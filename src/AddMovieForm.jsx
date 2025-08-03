import { useState } from 'react';
import { motion } from 'framer-motion';

// IMPORTANT: Add your OMDb API key here.
// For a real application, this should be in a .env file, but for this personal project, this is fine.
const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;

function AddMovieForm({ categories, onClose, onAddMovie }) {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [category, setCategory] = useState(categories[0] || '');
  const [fetchedData, setFetchedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetchDetails = async () => {
    if (!title) {
      setError('Please enter a title to fetch.');
      return;
    }
    setIsLoading(true);
    setError('');
    setFetchedData(null);

    try {
      const response = await fetch(`https://www.omdbapi.com/?t=${title}&y=${year}&apikey=${OMDB_API_KEY}&plot=full`);
      const data = await response.json();

      if (data.Response === 'True') {
        setFetchedData({
          title: data.Title,
          year: data.Year,
          overview: data.Plot,
          release_date: data.Released,
          runtime: data.Runtime,
          genre: data.Genre,
          director: data.Director,
          actors: data.Actors,
          rating: data.imdbRating,
          poster_path: data.Poster,
        });
      } else {
        setError(data.Error || 'Movie not found.');
      }
    } catch (err) {
      setError('Failed to fetch data. Check your connection.');
    }
    setIsLoading(false);
  };

  const handleSaveMovie = () => {
    if (!fetchedData) {
      setError('Please fetch movie details before saving.');
      return;
    }
    onAddMovie({ ...fetchedData, category });
    onClose();
  };

  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="modal-content"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
      >
        <h2>Add a New Movie</h2>
        <div className="form-group">
          <label>Movie Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., The Matrix" />
        </div>
        <div className="form-group">
          <label>Year (Optional)</label>
          <input type="text" value={year} onChange={(e) => setYear(e.target.value)} placeholder="e.g., 1999" />
        </div>
        <button onClick={handleFetchDetails} disabled={isLoading}>
          {isLoading ? 'Fetching...' : 'Fetch Details'}
        </button>

        {error && <p className="error-message">{error}</p>}

        {fetchedData && (
          <div className="fetched-preview">
            <img src={fetchedData.poster_path} alt="Poster" />
            <div>
              <h3>{fetchedData.title} ({fetchedData.year})</h3>
              <p>{fetchedData.overview.substring(0, 100)}...</p>
              <div className="form-group">
                <label>Add to Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <button className="save-button" onClick={handleSaveMovie}>Save Movie</button>
            </div>
          </div>
        )}

        <button className="close-button" onClick={onClose}>Close</button>
      </motion.div>
    </motion.div>
  );
}

export default AddMovieForm;
