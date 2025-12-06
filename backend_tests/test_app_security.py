import os

import pytest

from app.api import opensea_routes


def test_csrf_restore_returns_token(client):
    resp = client.get("/api/csrf/restore")

    assert resp.status_code == 200
    data = resp.get_json()
    assert "csrf_token" in data
    assert isinstance(data["csrf_token"], str)
    assert len(data["csrf_token"]) > 10


def test_https_redirect_triggers_in_production(client, monkeypatch):
    monkeypatch.setenv("FLASK_ENV", "production")
    resp = client.get("/", headers={"X-Forwarded-Proto": "http"})

    assert resp.status_code == 301
    assert resp.headers["Location"].startswith("https://")


def test_api_docs_includes_csrf_route(client):
    resp = client.get("/api/docs")

    assert resp.status_code == 200
    body = resp.get_json()
    assert "/api/csrf/restore" in body


def test_auth_unauthorized_endpoint(client):
    resp = client.get("/api/auth/unauthorized")

    assert resp.status_code == 401
    assert resp.get_json()["errors"]["message"] == "Unauthorized"


def test_opensea_collection_404_converts_to_404_status(client, monkeypatch):
    def raise_not_found(path, params=None):
        raise RuntimeError("404:Not Found")

    monkeypatch.setattr(opensea_routes, "_fetch_opensea", raise_not_found)

    resp = client.get("/api/opensea/collections/missing")

    assert resp.status_code == 404
    body = resp.get_json()
    assert body["error"] == "Failed to fetch OpenSea collection"
