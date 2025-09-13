import React, { useState, useEffect } from "react";
import { storeAPI, ratingAPI } from "../../services/api";
import LoadingSpinner from "../common/LoadingSpinner";

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    sortBy: "name",
    sortOrder: "ASC",
  });
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    fetchStores();
  }, [filters]);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const response = await storeAPI.getStoresForUser(filters);
      if (response.data.success) {
        setStores(response.data.stores);
      }
    } catch (error) {
      console.error("Failed to fetch stores:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRateStore = async (store) => {
    setSelectedStore(store);
    setUserRating(store.user_rating || 0);
    setShowRatingModal(true);
  };

  const submitRating = async () => {
    if (userRating < 1 || userRating > 5) {
      alert("Please select a rating between 1 and 5");
      return;
    }

    setSubmittingRating(true);
    try {
      const response = await ratingAPI.submitRating({
        storeId: selectedStore.id,
        rating: userRating,
      });

      if (response.data.success) {
        setShowRatingModal(false);
        fetchStores();
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Failed to submit rating:", error);
      alert("Failed to submit rating");
    } finally {
      setSubmittingRating(false);
    }
  };

  const renderStarRating = (
    rating,
    interactive = false,
    onRatingChange = null
  ) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`text-xl ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            } ${
              interactive
                ? "hover:text-yellow-400 cursor-pointer"
                : "cursor-default"
            }`}
            onClick={
              interactive && onRatingChange
                ? () => onRatingChange(star)
                : undefined
            }
            disabled={!interactive}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Stores</h1>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by store name or address..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">Sort by Name</option>
            <option value="address">Sort by Address</option>
            <option value="average_rating">Sort by Rating</option>
          </select>
          <select
            value={filters.sortOrder}
            onChange={(e) =>
              setFilters({ ...filters, sortOrder: e.target.value })
            }
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ASC">Ascending</option>
            <option value="DESC">Descending</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col h-full"
            >
              <div className="p-6 pb-0">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 min-h-[2rem] line-clamp-2">
                  {store.name}
                </h3>

                <div className="text-sm text-gray-600 mb-4">
                  <p className="min-h-[2.5rem] line-clamp-2">
                    <span className="font-medium">Address:</span>{" "}
                    {store.address}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-4 flex-grow">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Overall Rating:
                    </span>
                    <span className="text-sm text-gray-600 font-medium">
                      {store.average_rating
                        ? `${parseFloat(store.average_rating).toFixed(1)}/5`
                        : "No ratings"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    {renderStarRating(Math.round(store.average_rating || 0))}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Your Rating:
                    </span>
                    {store.user_rating && (
                      <span className="text-sm text-blue-600 font-medium">
                        {store.user_rating}/5
                      </span>
                    )}
                  </div>

                  {store.user_rating ? (
                    <div>
                      <div className="flex items-center mb-2">
                        {renderStarRating(store.user_rating)}
                      </div>
                      <button
                        onClick={() => handleRateStore(store)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Modify Rating
                      </button>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 mb-2">
                      Not rated yet
                    </div>
                  )}
                </div>
              </div>
              <div className="p-6 pt-0 mt-auto">
                {!store.user_rating && (
                  <button
                    onClick={() => handleRateStore(store)}
                    className="w-full px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Rate This Store
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {stores.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-900 mb-1">
            No stores found
          </p>
          <p className="text-gray-500">Try adjusting your search filters</p>
        </div>
      )}

      {showRatingModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Rate {selectedStore?.name}
              </h2>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">
                  Select your rating (1-5 stars):
                </p>
                <div className="flex justify-center mb-3">
                  {renderStarRating(userRating, true, setUserRating)}
                </div>
                <p className="text-center text-sm font-medium text-gray-700">
                  {userRating > 0
                    ? `${userRating}/5 stars`
                    : "No rating selected"}
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowRatingModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
                  disabled={submittingRating}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitRating}
                  disabled={submittingRating || userRating === 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                >
                  {submittingRating ? "Submitting..." : "Submit Rating"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreList;
