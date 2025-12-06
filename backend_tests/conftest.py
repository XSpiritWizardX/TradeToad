import os
import sys
import types

import pytest

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

# Provide a lightweight stub for optional polygon dependency during tests
if "polygon" not in sys.modules:
    dummy_polygon = types.SimpleNamespace()

    class DummyRESTClient:
        def __init__(self, *args, **kwargs):
            pass

    dummy_polygon.RESTClient = DummyRESTClient
    sys.modules["polygon"] = dummy_polygon

from app import app as flask_app


@pytest.fixture()
def client():
    flask_app.config.update(TESTING=True)
    os.environ.setdefault("FLASK_ENV", "testing")
    with flask_app.test_client() as client:
        yield client
