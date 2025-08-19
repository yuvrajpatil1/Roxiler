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
        fetchStores(); // Refresh the store list
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
            className={`text-2xl ${
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
            <div key={store.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {store.name}
              </h3>

              <div className="text-sm text-gray-600 mb-4">
                <p className="mb-1">
                  <span className="font-medium">Address:</span> {store.address}
                </p>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Overall Rating:
                  </span>
                  <span className="text-sm text-gray-600">
                    {store.average_rating
                      ? `${parseFloat(store.average_rating).toFixed(1)}/5`
                      : "No ratings yet"}
                  </span>
                </div>
                {renderStarRating(Math.round(store.average_rating || 0))}
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Your Rating:
                  </span>
                  {store.user_rating && (
                    <span className="text-sm text-blue-600">
                      {store.user_rating}/5
                    </span>
                  )}
                </div>
                {store.user_rating ? (
                  <div>
                    {renderStarRating(store.user_rating)}
                    <button
                      onClick={() => handleRateStore(store)}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                      Modify Rating
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRateStore(store)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
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
        <div className="text-center py-8">
          <p className="text-gray-500">No stores found.</p>
        </div>
      )}

      {showRatingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-lg bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">
              Rate {selectedStore?.name}
            </h2>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">
                Select your rating (1-5 stars):
              </p>
              <div className="flex justify-center">
                {renderStarRating(userRating, true, setUserRating)}
              </div>
              <p className="text-center mt-2 text-sm text-gray-500">
                {userRating}/5 stars
              </p>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowRatingModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={submittingRating}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitRating}
                disabled={submittingRating || userRating === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingRating ? "Submitting..." : "Submit Rating"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreList;
