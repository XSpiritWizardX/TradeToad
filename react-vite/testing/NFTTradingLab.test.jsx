import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { act } from "react";
import NFTTradingLab from "../src/components/NFTTradingLab/NFTTradingLab";
import { getCollection, getCollections, getListingsByCollection } from "../src/api/opensea";

vi.mock("../src/api/opensea", () => ({
  getCollection: vi.fn(),
  getListingsByCollection: vi.fn(),
  getCollections: vi.fn(),
}));

const baseCollection = {
  name: "Sample Collection",
  description: "A sample collection",
  total_supply: 42,
  floor_price: 1.5,
  num_owners: 10,
  image_url: "https://example.com/sample.png",
};

beforeEach(() => {
  vi.clearAllMocks();
  getCollections.mockResolvedValue({ collections: [] });
  getCollection.mockResolvedValue({ collection: baseCollection });
  getListingsByCollection.mockResolvedValue({ listings: [] });
});

const click = async (el) => act(async () => userEvent.click(el));
const type = async (el, text) => act(async () => userEvent.type(el, text));

async function renderLab() {
  await act(async () => {
    render(<NFTTradingLab />);
  });
  await waitFor(() => expect(getCollections).toHaveBeenCalled());
}

describe("NFTTradingLab", () => {
  it("disables fetch buttons while loading initial collections", async () => {
    let resolveFetch;
    const deferred = new Promise((res) => {
      resolveFetch = res;
    });
    getCollections.mockReturnValueOnce(deferred);

    render(<NFTTradingLab />);

    const loadingButtons = screen.getAllByRole("button", { name: /loading/i });
    expect(loadingButtons.length).toBeGreaterThan(0);
    loadingButtons.forEach((btn) => expect(btn).toBeDisabled());

    await act(async () => resolveFetch({ collections: [] }));
    const readyBtn = await screen.findByRole("button", { name: /fetch from opensea/i });
    expect(readyBtn).not.toBeDisabled();
  });

  it("fetches collections on mount using trending order", async () => {
    await renderLab();

    await waitFor(() => {
      expect(getCollections).toHaveBeenCalledWith({
        limit: 12,
        cursor: null,
        sample: false,
        orderBy: "one_day_volume",
      });
    });
  });

  it("shows validation error when no slug is provided", async () => {
    await renderLab();

    const fetchBtn = await screen.findByRole("button", { name: /fetch from opensea/i });
    await click(fetchBtn);

    expect(screen.getByText(/enter a collection slug/i)).toBeInTheDocument();
    expect(getCollection).not.toHaveBeenCalled();
  });

  it("fetches a collection + listings for a typed slug", async () => {
    getListingsByCollection.mockResolvedValueOnce({
      listings: [
        {
          price: { current: { price: "2.5" } },
          protocol_data: { parameters: { offer: [{ itemType: 2, identifierOrCriteria: "11" }] } },
          status: "open",
        },
      ],
    });

    await renderLab();

    await type(screen.getByLabelText(/collection slug/i), "coolcats");
    const fetchBtn = await screen.findByRole("button", { name: /fetch from opensea/i });
    await click(fetchBtn);

    await waitFor(() => expect(getCollection).toHaveBeenCalledWith("coolcats"));
    expect(getListingsByCollection).toHaveBeenCalledWith("coolcats", { limit: 5 });
    expect(screen.getByText(baseCollection.name)).toBeInTheDocument();
    expect(screen.getByText(/Price:\s*2\.5/i)).toBeInTheDocument();
    expect(screen.queryByText(/No drops yet/i)).not.toBeInTheDocument();
  });

  it("shows error when fetch fails and keeps drops empty", async () => {
    getCollection.mockRejectedValueOnce(new Error("boom"));

    await renderLab();

    await type(screen.getByLabelText(/collection slug/i), "fail");
    const fetchBtn = await screen.findByRole("button", { name: /fetch from opensea/i });
    await click(fetchBtn);

    await waitFor(() => expect(screen.getByText(/boom/i)).toBeInTheDocument());
    expect(screen.getByText(/No drops yet/i)).toBeInTheDocument();
    expect(getListingsByCollection).not.toHaveBeenCalled();
  });

  it("loads sample data and renders collection and activity", async () => {
    const listing = {
      listings: [
        {
          status: "open",
          price: { current: { price: "1.2" } },
          protocol_data: {
            parameters: {
              offer: [{ itemType: 2, identifierOrCriteria: "99" }],
              consideration: [{ startAmount: "1200000000000000000" }],
            },
          },
        },
      ],
    };
    getListingsByCollection.mockResolvedValueOnce(listing);

    await renderLab();

    await click(screen.getByRole("button", { name: /load sample data/i }));

    await waitFor(() => expect(screen.getByText(baseCollection.name)).toBeInTheDocument());
    const mintedValue = screen.getByText(/Minted/i).parentElement?.querySelector("h3");
    expect(mintedValue).not.toBeNull();
    expect(mintedValue).toHaveTextContent(String(baseCollection.total_supply));
    expect(screen.getByText(/Price:\s*1\.2/i)).toBeInTheDocument();
  });

  it("renders sparkline fallback when no data exists", async () => {
    getCollections.mockResolvedValueOnce({
      collections: [
        {
          name: "No Data",
          slug: "nodata",
          description: "missing sparkline",
          stats: { sparkline_prices: [] },
        },
      ],
    });

    await renderLab();

    expect(screen.getByText(/7d chart coming soon/i)).toBeInTheDocument();
  });

  it("loads stats for a collection card and calculates floor from listings", async () => {
    const collectionWithoutStats = {
      collection: "stat-slug",
      name: "Needs Stats",
      description: "desc",
      category: "art",
      image_url: "https://example.com/art.png",
    };
    getCollections.mockResolvedValueOnce({ collections: [collectionWithoutStats] });

    const statsResponse = {
      collection: {
        ...collectionWithoutStats,
        stats: { one_day_change: 0.12, num_owners: 5, total_supply: 25, sparkline_prices: [1, 2, 3] },
      },
    };
    getCollection.mockResolvedValueOnce(statsResponse);
    getListingsByCollection.mockResolvedValueOnce({
      listings: [
        {
          price: {
            protocol_data: {
              parameters: {
                consideration: [{ startAmount: "50000000000000000" }],
                offer: [{ itemType: 2, identifierOrCriteria: "7" }],
              },
            },
          },
        },
      ],
    });

    await renderLab();

    const cardTitle = await screen.findByText(/needs stats/i);
    const card = cardTitle.closest(".nft-collection-card");
    expect(card).not.toBeNull();
    await click(within(card).getByRole("button", { name: /load stats/i }));

    await waitFor(() => {
      expect(getCollection).toHaveBeenCalledWith("stat-slug");
      expect(screen.getByText(/0.05 ETH/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/12.00%/)).toBeInTheDocument();
  });

  it("paginates collections and fetches with next cursor", async () => {
    getCollections
      .mockResolvedValueOnce({
        collections: [{ name: "First", slug: "first", description: "one" }],
        next: "CUR1",
      })
      .mockResolvedValueOnce({
        collections: [{ name: "Second", slug: "second", description: "two" }],
        next: null,
      });

    await renderLab();

    await screen.findByText(/first/i);
    const loadMore = screen.getByRole("button", { name: /load more/i });
    await click(loadMore);

    await waitFor(() => expect(screen.getByText(/second/i)).toBeInTheDocument());
    expect(getCollections).toHaveBeenLastCalledWith({
      limit: 12,
      cursor: "CUR1",
      sample: false,
      orderBy: null,
    });
  });

  it("re-fetches collections when limit input changes", async () => {
    await renderLab();

    const limitInput = screen.getByLabelText(/limit/i);
    await act(async () => userEvent.clear(limitInput));
    await type(limitInput, "5");

    await waitFor(() =>
      expect(getCollections).toHaveBeenLastCalledWith({
        limit: 5,
        cursor: null,
        sample: false,
        orderBy: null,
      }),
    );
  });
});
