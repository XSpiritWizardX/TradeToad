import { useCallback, useEffect, useState } from 'react';
import './NFTTradingLab.css';
import { getCollection, getListingsByCollection, getCollections } from '../../api/opensea';

function NFTTradingLab() {
  const [slug, setSlug] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [collection, setCollection] = useState(null);
  const [listings, setListings] = useState([]);
  const [collections, setCollections] = useState([]);
  const [collectionsCursor, setCollectionsCursor] = useState(null);

  const handleFetch = async () => {
    if (!slug.trim()) {
      setError('Enter a collection slug (e.g., boredapeyachtclub)');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const collectionRes = await getCollection(slug.trim());
      const listingRes = await getListingsByCollection(slug.trim(), { limit: 5 });
      setCollection(collectionRes.collection || collectionRes);
      setListings(listingRes.listings || listingRes.orders || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch OpenSea data');
      setCollection(null);
      setListings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const parseListingPriceEth = (priceObj) => {
    const direct = priceObj?.current?.price;
    if (direct) {
      const parsed = Number.parseFloat(direct);
      if (!Number.isNaN(parsed)) return parsed;
    }
    const raw = priceObj?.protocol_data?.parameters?.consideration?.[0]?.startAmount;
    if (raw) {
      try {
        const bigint = BigInt(raw);
        const eth = Number(bigint) / 1e18;
        return eth;
      } catch (e) {
        return undefined;
      }
    }
    return undefined;
  };

  const loadCollectionStats = async (slug, index) => {
    if (!slug) {
      setError('Missing collection slug for stats');
      return;
    }
    setError('');
    try {
      const colRes = await getCollection(slug);
      let listingRes = null;
      try {
        listingRes = await getListingsByCollection(slug, { limit: 10 });
      } catch (listingErr) {
        // ignore listing errors (404/missing) and keep collection data
        console.warn('Listings fetch failed', listingErr);
      }
      const data = colRes.collection || colRes;
      const list = listingRes ? listingRes.listings || listingRes.orders || [] : [];
      const floorPrices = list
        .map((item) => parseListingPriceEth(item.price || item))
        .filter((p) => typeof p === 'number' && !Number.isNaN(p));
      const floorFromListings = floorPrices.length ? Math.min(...floorPrices) : undefined;

      setCollections((prev) => {
        const copy = [...prev];
        copy[index] = {
          ...copy[index],
          ...data,
          stats: {
            ...(copy[index].stats || {}),
            ...(data.stats || {}),
            floor_price:
              floorFromListings ??
              data.floor_price ??
              data.stats?.floor_price ??
              copy[index].stats?.floor_price,
            one_day_change:
              data.one_day_change ??
              data.stats?.one_day_change ??
              copy[index].stats?.one_day_change,
            num_owners:
              data.num_owners ?? data.stats?.num_owners ?? copy[index].stats?.num_owners,
            total_supply:
              data.total_supply ?? data.stats?.total_supply ?? copy[index].stats?.total_supply,
            sparkline_prices:
              data.stats?.sparkline_prices ??
              data.sparkline ??
              copy[index].stats?.sparkline_prices,
          },
        };
        return copy;
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch collection stats');
    }
  };

  const renderSparkline = (data) => {
    const points = Array.isArray(data) ? data.slice(-14) : [];
    if (!points.length) return <span className="nft-hint">7d chart coming soon</span>;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    return (
      <div className="sparkline">
        {points.map((p, i) => {
          const h = ((p - min) / range) * 100;
          return <span key={i} style={{ height: `${h}%` }} />;
        })}
      </div>
    );
  };

  const handleSample = async () => {
    setIsLoading(true);
    setError('');
    try {
      const collectionRes = await getCollection('sample', { sample: true });
      const listingRes = await getListingsByCollection('sample', { sample: true });
      setCollection(collectionRes.collection || collectionRes);
      setListings(listingRes.listings || listingRes.orders || []);
    } catch (err) {
      setError(err.message || 'Failed to load sample data');
      setCollection(null);
      setListings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCollections = useCallback(async (limit = 12, cursor = null, sample = false, orderBy = null) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getCollections({ limit, cursor, sample, orderBy });
      const list = data.collections || [];
      setCollections((prev) => (cursor ? [...prev, ...list] : list));
      setCollectionsCursor(data.next || null);
    } catch (err) {
      setError(err.message || 'Failed to fetch collections');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCollections(12, null, false, 'one_day_volume');
  }, [fetchCollections]);

  const showStats = Boolean(collection);
  const apiKeyMissing = !import.meta.env.VITE_OPENSEA_API_KEY;

  return (
    <div className="nft-lab">
      <header className="nft-lab__header">
        <div>
          <p className="nft-kicker">On-chain sandbox -- open sea connected</p>
          <h1 className="nft-title">NFT Trade Lab -- In Development</h1>
          <p className="nft-lede">
            Dashboard for everything NFTs—create drops, publish mint pages, and track activity. Buttons are wired next.
          </p>
        </div>
        <div className="nft-actions">
          <button className="nft-btn">Create NFT Drop</button>
          <button className="nft-btn nft-btn--ghost">Publish Mint Page</button>
        </div>
      </header>

      <section className="nft-cards">
        <div className="nft-card">
          <p className="nft-card__label">Total drops</p>
          <h3 className="nft-card__value">{showStats ? 1 : 0}</h3>
          <p className="nft-card__hint">
            {showStats ? 'Loaded from OpenSea.' : 'We\'ll fetch counts once contracts are live.'}
          </p>
        </div>
        <div className="nft-card">
          <p className="nft-card__label">Minted</p>
          <h3 className="nft-card__value">
            {showStats ? (collection?.total_supply ?? '—') : 0}
          </h3>
          <p className="nft-card__hint">Real-time receipts will appear here.</p>
        </div>
        <div className="nft-card">
          <p className="nft-card__label">Live supply</p>
          <h3 className="nft-card__value">
            {showStats
              ? `${collection?.total_supply ?? '—'} / ${collection?.total_supply ?? '—'}`
              : '0 / 0'}
          </h3>
          <p className="nft-card__hint">Tracks available supply per drop.</p>
        </div>
      </section>

      <section className="nft-panel nft-panel--wide">
        <div className="nft-panel__header">
          <h2>Check a live collection</h2>
          <span className="nft-badge">OpenSea API</span>
        </div>
        <div className="nft-form">
          <div className="nft-field">
            <label htmlFor="slug">Collection slug</label>
            <input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="boredapeyachtclub"
            />
          </div>
          <button className="nft-btn" onClick={handleFetch} disabled={isLoading}>
            {isLoading ? 'Loading…' : 'Fetch from OpenSea'}
          </button>
          {apiKeyMissing && (
            <div className="nft-hint">
              Add OPENSEA_API_KEY on the server (and VITE_OPENSEA_API_KEY if you want client direct calls).
            </div>
          )}
          <button className="nft-btn nft-btn--ghost" onClick={handleSample}>
            Load sample data
          </button>
          {error && <div className="nft-error">{error}</div>}
        </div>
      </section>

      <section className="nft-panel nft-panel--wide">
        <div className="nft-panel__header">
          <h2>Collections</h2>
          <div className="nft-form nft-form--inline">
            <div className="nft-field">
              <label htmlFor="collections-limit">Limit</label>
              <input
                id="collections-limit"
                type="number"
                min="1"
                max="100"
                defaultValue={12}
                onChange={(e) => {
                  const val = Number(e.target.value) || 12;
                  setCollectionsCursor(null);
                  setCollections([]);
                  fetchCollections(val, null);
                }}
              />
            </div>
            <button className="nft-btn" onClick={() => fetchCollections(12, null)} disabled={isLoading}>
              {isLoading ? 'Loading…' : 'Fetch collections'}
            </button>
            <button className="nft-btn" onClick={() => fetchCollections(12, null, false, 'one_day_volume')} disabled={isLoading}>
              {isLoading ? 'Loading…' : 'Trending (24h volume)'}
            </button>
            <button className="nft-btn nft-btn--ghost" onClick={() => fetchCollections(12, null, true)}>
              Load sample
            </button>
          </div>
        </div>
        <div className="nft-collection-grid">
          {collections.map((col, idx) => (
            <div className="nft-collection-card" key={`${col.collection || col.name || idx}-${idx}`}>
              {col.image_url && (
                <img src={col.image_url} alt={col.name} className="nft-collection-card__img" />
              )}
              <div className="nft-collection-card__body">
                <h3>{col.name || col.collection || 'Untitled'}</h3>
                <p>{col.description || 'No description provided.'}</p>
                <div className="nft-collection-card__meta">
                  <span>{col.category || 'uncategorized'}</span>
                  {col.opensea_url && (
                    <a href={col.opensea_url} target="_blank" rel="noreferrer" className="nft-link">
                      View
                    </a>
                  )}
                  {!col.stats && (
                    <button
                      className="nft-link"
                      onClick={() => loadCollectionStats(col.collection || col.slug || col.name, idx)}
                    >
                      Load stats
                    </button>
                  )}
                </div>
                <div className="nft-collection-card__stats">
                  <div>
                    <p className="nft-card__label">Floor</p>
                    <p className="nft-card__value">
                      {col.stats?.floor_price ?? col.floor_price ?? col.stats?.floorPrice ?? '—'} ETH
                    </p>
                  </div>
                  <div>
                    <p className="nft-card__label">1D Δ</p>
                    <p className={`nft-card__value ${Number(col.one_day_change ?? col.stats?.one_day_change) >= 0 ? 'pos' : 'neg'}`}>
                      {col.one_day_change !== undefined || col.stats?.one_day_change !== undefined
                        ? `${((col.one_day_change ?? col.stats?.one_day_change) * 100).toFixed(2)}%`
                        : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="nft-card__label">Owners</p>
                    <p className="nft-card__value">{col.num_owners ?? col.stats?.num_owners ?? '—'}</p>
                  </div>
                  <div>
                    <p className="nft-card__label">Supply</p>
                    <p className="nft-card__value">{col.total_supply ?? col.stats?.total_supply ?? '—'}</p>
                  </div>
                </div>
                <div className="nft-sparkline">
                  {renderSparkline(col.stats?.sparkline_prices || col.sparkline || [])}
                </div>
              </div>
            </div>
          ))}
          {collections.length === 0 && <p className="nft-hint">No collections loaded yet.</p>}
        </div>
        {collectionsCursor && (
          <button
            className="nft-btn"
            onClick={() => fetchCollections(12, collectionsCursor)}
            disabled={isLoading}
          >
            {isLoading ? 'Loading…' : 'Load more'}
          </button>
        )}
      </section>

      <section className="nft-panels">
        <div className="nft-panel">
          <div className="nft-panel__header">
            <h2>Live drops</h2>
            <button className="nft-link">View all</button>
          </div>
          {collection ? (
            <div className="nft-collection">
              {collection.image_url && (
                <img src={collection.image_url} alt={collection.name} className="nft-collection__img" />
              )}
              <div className="nft-collection__meta">
                <h3>{collection.name || 'Untitled'}</h3>
                <p>{collection.description || 'No description provided.'}</p>
                <div className="nft-collection__stats">
                  <span>Floor: {collection?.floor_price ?? '—'} ETH</span>
                  <span>Items: {collection?.total_supply ?? '—'}</span>
                  <span>Owners: {collection?.num_owners ?? '—'}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="nft-table">
              <div className="nft-row nft-row--head">
                <span>Collection</span>
                <span>Price</span>
                <span>Minted</span>
                <span>Status</span>
              </div>
              <div className="nft-row nft-row--empty">
                <span>No drops yet</span>
                <span>—</span>
                <span>—</span>
                <span>Draft</span>
              </div>
            </div>
          )}
        </div>

        <div className="nft-panel">
          <div className="nft-panel__header">
            <h2>Activity</h2>
            <button className="nft-link">Refresh</button>
          </div>
          {listings && listings.length > 0 ? (
            <ul className="nft-activity">
              {listings.map((item, idx) => (
                <li key={idx}>
                  <strong>{item.protocol_data?.parameters?.offer?.[0]?.itemType === 2 ? 'NFT' : 'Listing'}</strong>{' '}
                  {item.protocol_data?.parameters?.offer?.[0]?.identifierOrCriteria
                    ? `#${item.protocol_data.parameters.offer[0].identifierOrCriteria}`
                    : ''}
                  {' · '}Price:{' '}
                  {item.price?.current?.price ?? item.protocol_data?.parameters?.consideration?.[0]?.startAmount ?? '—'}
                  {' · '}Status: {item.status || 'open'}
                </li>
              ))}
            </ul>
          ) : (
            <ul className="nft-activity">
              <li>No transactions yet. Mints and purchases will show here with wallet + tx hash.</li>
            </ul>
          )}
        </div>
      </section>

      <section className="nft-panel nft-panel--wide">
        <div className="nft-panel__header">
          <h2>Coming wiring</h2>
        </div>
        <ul className="nft-list">
          <li>Wallet connect + chain guardrails (Base Sepolia / Arbitrum Sepolia).</li>
          <li>Deploy + configure ERC-721 drops, set supply and mint price.</li>
          <li>Mint page publishing with shareable links and live supply counters.</li>
          <li>Activity feed driven by contract events (mint, list, buy).</li>
        </ul>
      </section>
    </div>
  );
}

export default NFTTradingLab;
