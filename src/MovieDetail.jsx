import { motion as motion3 } from 'framer-motion';

function MovieDetail({ movie, onGoBack, onDeleteMovie }) {
  const backdropStyle = { backgroundImage: `linear-gradient(to top, #121212 10%, rgba(18, 18, 18, 0.7)), url(${movie.poster_path})` };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${movie.title}"?`)) {
      onDeleteMovie(movie.id);
    }
  };

  return (
    <motion3.div className="detail-view-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="detail-backdrop" style={backdropStyle}></div>
      <div className="detail-content">
        <motion3.div className="detail-poster" layoutId={`card-${movie.id}`}>
          <img src={movie.poster_path} alt={movie.title} onError={(e) => { e.target.src = 'https://placehold.co/300x450/1f1f1f/ffffff?text=No+Image' }} />
        </motion3.div>
        <div className="detail-info">
          <h1>{movie.title} ({movie.year})</h1>
          <div className="detail-meta"><span className="rating">⭐ {movie.rating} / 10</span><span className="runtime">{movie.runtime}</span></div>
          <p className="genre">{movie.genre}</p>
          <p className="overview">{movie.overview}</p>
          <div className="crew"><p><strong>Director:</strong> {movie.director}</p><p><strong>Starring:</strong> {movie.actors}</p></div>
          <div className="button-group">
            <button className="back-button" onClick={onGoBack}>← Back to Library</button>
            <button className="delete-button" onClick={handleDelete}>Delete Movie</button>
          </div>
        </div>
      </div>
    </motion3.div>
  );
}
export default MovieDetail;