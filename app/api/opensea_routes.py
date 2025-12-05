import json
import os
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from flask import Blueprint, jsonify, request

opensea_routes = Blueprint('opensea', __name__)

API_ROOT = "https://api.opensea.io/api/v2"
API_KEY = os.environ.get("OPENSEA_API_KEY")
TIMEOUT = 10

SAMPLE_COLLECTION = {
    "name": "Sample Drop",
    "description": "Static sample data. Add OPENSEA_API_KEY for live results.",
    "floor_price": "1.25",
    "total_supply": "1000",
    "num_owners": "420",
    "image_url": "https://storage.googleapis.com/opensea-static/Logomark/Logomark-Blue.png"
}

SAMPLE_LISTINGS = [
    {
        "status": "open",
        "price": {"current": {"price": "1.5 ETH"}},
        "protocol_data": {
            "parameters": {
                "offer": [{"identifierOrCriteria": "1234", "itemType": 2}],
                "consideration": [{"startAmount": "1.5 ETH"}]
            }
        }
    },
    {
        "status": "open",
        "price": {"current": {"price": "0.9 ETH"}},
        "protocol_data": {
            "parameters": {
                "offer": [{"identifierOrCriteria": "5678", "itemType": 2}],
                "consideration": [{"startAmount": "0.9 ETH"}]
            }
        }
    }
]

SAMPLE_COLLECTIONS = {
    "collections": [
        {
            "collection": "sample-collection",
            "name": "Sample Collection",
            "description": "Static sample data. Add OPENSEA_API_KEY for live results.",
            "image_url": "https://storage.googleapis.com/opensea-static/Logomark/Logomark-Blue.png",
            "banner_image_url": "https://storage.googleapis.com/opensea-static/Brand/opensea-banner.png",
            "owner": "0x0",
            "category": "art",
            "opensea_url": "https://opensea.io/collection/sample-collection",
            "contracts": [{"address": "0x0", "chain": "ethereum"}],
            "floor_price": 1.25,
            "total_supply": 1000,
            "num_owners": 420,
            "one_day_change": 0.12,
            "sparkline": [1.1, 1.2, 1.05, 1.25, 1.3, 1.22, 1.25]
        }
    ],
    "next": None
}


def _fetch_opensea(path, params=None):
    headers = {
        "accept": "application/json",
        "User-Agent": "TradeToad/1.0 (+https://opensea.io)"
    }
    if API_KEY:
        headers["X-API-KEY"] = API_KEY
    query = f"?{urlencode(params)}" if params else ""
    req = Request(f"{API_ROOT}{path}{query}", headers=headers)
    try:
        with urlopen(req, timeout=TIMEOUT) as resp:
            if resp.status == 401:
                raise PermissionError("OpenSea API key missing or invalid. Set OPENSEA_API_KEY.")
            if resp.status >= 400:
                raise HTTPError(req.full_url, resp.status, "OpenSea error", resp.headers, None)
            body = resp.read()
            return json.loads(body.decode("utf-8"))
    except HTTPError as err:
        body = None
        try:
            body = err.read().decode("utf-8")
        except Exception:
            body = None
        if err.code == 401:
            raise PermissionError("OpenSea API key missing or invalid. Set OPENSEA_API_KEY.")
        detail = body if body else f"HTTP {err.code}"
        raise RuntimeError(f"{err.code}:{detail}")
    except URLError as err:
        raise ConnectionError(f"Failed to reach OpenSea: {err}") from err


@opensea_routes.route("/collections/<slug>", methods=["GET"])
def collection(slug):
    """
    Proxy to OpenSea collection endpoint. Provide ?sample=true to see static data without a key.
    """
    use_sample = request.args.get("sample") == "true"
    if use_sample:
        return jsonify({"collection": SAMPLE_COLLECTION})
    try:
        data = _fetch_opensea(f"/collections/{slug}")
        return jsonify(data)
    except PermissionError as err:
        return jsonify({"error": str(err)}), 401
    except Exception as err:
        detail = str(err)
        status = 502
        if detail.startswith("404"):
            status = 404
        return jsonify({"error": "Failed to fetch OpenSea collection", "detail": detail}), status


@opensea_routes.route("/collections/<slug>/listings", methods=["GET"])
def collection_listings(slug):
    """
    Proxy to OpenSea listings-by-collection endpoint. Provide ?sample=true for static data.
    """
    use_sample = request.args.get("sample") == "true"
    limit = request.args.get("limit", default=5, type=int)
    if use_sample:
        return jsonify({"listings": SAMPLE_LISTINGS})
    try:
        data = _fetch_opensea(f"/listings/collection/{slug}", params={"limit": limit})
        return jsonify(data)
    except PermissionError as err:
        return jsonify({"error": str(err)}), 401
    except Exception as err:
        detail = str(err)
        status = 502
        if detail.startswith("404"):
            status = 404
        return jsonify({"error": "Failed to fetch OpenSea listings", "detail": detail}), status


@opensea_routes.route("/collections/<slug>/nfts", methods=["GET"])
def collection_nfts(slug):
    """
    Proxy to OpenSea NFTs-by-collection endpoint.
    Query params: limit (1-100), next (cursor).
    """
    limit = request.args.get("limit", default=20, type=int)
    cursor = request.args.get("next")
    params = {"limit": limit}
    if cursor:
        params["next"] = cursor
    try:
        data = _fetch_opensea(f"/collection/{slug}/nfts", params=params)
        return jsonify(data)
    except PermissionError as err:
        return jsonify({"error": str(err)}), 401
    except Exception as err:
        return jsonify({"error": "Failed to fetch OpenSea NFTs", "detail": str(err)}), 502


@opensea_routes.route("/collections", methods=["GET"])
def collections():
    """
    Proxy to OpenSea collections listing endpoint.
    Query params: limit (1-100), next (cursor), chain (optional), order_by (optional).
    Use ?sample=true for static data.
    """
    use_sample = request.args.get("sample") == "true"
    if use_sample:
        return jsonify(SAMPLE_COLLECTIONS)

    limit = request.args.get("limit", default=20, type=int)
    cursor = request.args.get("next")
    chain = request.args.get("chain")
    order_by = request.args.get("order_by")
    params = {"limit": limit}
    if cursor:
        params["next"] = cursor
    if chain:
        params["chain"] = chain
    if order_by:
        params["order_by"] = order_by
    try:
        data = _fetch_opensea("/collections", params=params)
        return jsonify(data)
    except PermissionError as err:
        return jsonify({"error": str(err)}), 401
    except Exception as err:
        return jsonify({"error": "Failed to fetch OpenSea collections", "detail": str(err)}), 502
