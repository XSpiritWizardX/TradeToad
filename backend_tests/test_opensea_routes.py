import json

import pytest

from app.api import opensea_routes


def test_sample_collection_returns_static_payload(client):
    resp = client.get("/api/opensea/collections/anything?sample=true")

    assert resp.status_code == 200
    data = resp.get_json()
    assert "collection" in data
    assert data["collection"]["name"] == opensea_routes.SAMPLE_COLLECTION["name"]


def test_sample_listings_returns_static_set(client):
    resp = client.get("/api/opensea/collections/demo/listings?sample=true&limit=7")

    assert resp.status_code == 200
    listings = resp.get_json()["listings"]
    assert len(listings) == len(opensea_routes.SAMPLE_LISTINGS)
    assert listings[0]["status"] == "open"


def test_sample_collections_returns_static_list(client):
    resp = client.get("/api/opensea/collections?sample=true")

    assert resp.status_code == 200
    data = resp.get_json()
    assert data["collections"][0]["name"] == opensea_routes.SAMPLE_COLLECTIONS["collections"][0]["name"]
    assert data["next"] is None


def test_collection_forwards_permission_error(client, monkeypatch):
    def fail_fetch(path, params=None):
        raise PermissionError("OpenSea API key missing or invalid. Set OPENSEA_API_KEY.")

    monkeypatch.setattr(opensea_routes, "_fetch_opensea", fail_fetch)

    resp = client.get("/api/opensea/collections/needs-key")

    assert resp.status_code == 401
    assert "missing or invalid" in resp.get_json()["error"]


def test_collections_passes_query_params_to_fetch(client, monkeypatch):
    calls = []

    def capture_fetch(path, params=None):
        calls.append((path, params))
        return {"collections": [], "next": None}

    monkeypatch.setattr(opensea_routes, "_fetch_opensea", capture_fetch)

    resp = client.get("/api/opensea/collections?limit=5&next=CUR&chain=base&order_by=one_day_volume")

    assert resp.status_code == 200
    assert calls == [
        (
            "/collections",
            {"limit": 5, "next": "CUR", "chain": "base", "order_by": "one_day_volume"},
        )
    ]


def test_listings_404_returns_404(client, monkeypatch):
    def raise_not_found(path, params=None):
        raise RuntimeError("404:Not Found")

    monkeypatch.setattr(opensea_routes, "_fetch_opensea", raise_not_found)

    resp = client.get("/api/opensea/collections/miss/listings")

    assert resp.status_code == 404
    body = resp.get_json()
    assert body["error"] == "Failed to fetch OpenSea listings"


def test_collection_nfts_passes_cursor_and_limit(client, monkeypatch):
    calls = []

    def capture_fetch(path, params=None):
        calls.append((path, params))
        return {"nfts": [], "next": None}

    monkeypatch.setattr(opensea_routes, "_fetch_opensea", capture_fetch)

    resp = client.get("/api/opensea/collections/demo/nfts?limit=15&next=NEXT123")

    assert resp.status_code == 200
    assert calls == [("/collection/demo/nfts", {"limit": 15, "next": "NEXT123"})]


def test_listings_permission_error_returns_401(client, monkeypatch):
    def raise_permission(path, params=None):
        raise PermissionError("Need API key")

    monkeypatch.setattr(opensea_routes, "_fetch_opensea", raise_permission)

    resp = client.get("/api/opensea/collections/keyless/listings")

    assert resp.status_code == 401
    assert "Need API key" in resp.get_json()["error"]
