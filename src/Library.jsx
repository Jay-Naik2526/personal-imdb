import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AddMovieForm from './AddMovieForm';
import { migrateData } from './migrate.js'; // Import for the migration button

function Library({ categories, moviesByCategory, filteredMovies, onSelectMovie, searchTerm, setSearchTerm, onAddMovie, selectedCategory, setSelectedCategory }) {
  const [hoveredBackground, setHoveredBackground] = useState('');
  const [isAddingMovie, setIsAddingMovie] = useState(false);
  const [sortOrder, setSortOrder] = useState('year-desc');

  useEffect(() => {
    if (selectedCategory && moviesByCategory[selectedCategory]?.length > 0) {
      setHoveredBackground(moviesByCategory[selectedCategory][0].poster_path);
    } else if (categories.length > 0 && moviesByCategory[categories[0]]?.length > 0) {
      setHoveredBackground(moviesByCategory[categories[0]][0].poster_path);
    }
  }, [selectedCategory, moviesByCategory, categories]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchTerm('');
  };

  const backgroundStyle = { backgroundImage: `url(${hoveredBackground})` };
  const isSearching = searchTerm.length > 0;
  const searchResultCategories = Object.keys(filteredMovies);

  const sortMovies = (movieList) => {
    const sorted = [...(movieList || [])];
    switch (sortOrder) {
      case 'year-desc': return sorted.sort((a, b) => (b.year || 0) - (a.year || 0));
      case 'year-asc': return sorted.sort((a, b) => (a.year || 0) - (b.year || 0));
      case 'alpha-asc': return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default: return sorted;
    }
  };

  const renderMovieCard = (movie) => (
    <motion.div key={movie.title + movie.year} className="movie-card" onClick={() => onSelectMovie(movie)} onHoverStart={() => setHoveredBackground(movie.poster_path)} whileHover={{ scale: 1.05 }} layoutId={`card-${movie.title}`}>
      <img src={movie.poster_path} alt={movie.title} onError={(e) => { e.target.src = 'https://placehold.co/300x450/1f1f1f/ffffff?text=No+Image' }} />
      <div className="card-title-overlay"><h3>{movie.title}</h3></div>
    </motion.div>
  );

  return (
    <>
      <AnimatePresence>{isAddingMovie && <AddMovieForm categories={categories} onClose={() => setIsAddingMovie(false)} onAddMovie={onAddMovie} />}</AnimatePresence>
      <div className="library-layout">
        <div className="main-background" style={backgroundStyle} />
        <div className="main-background-overlay" />
        <aside className="sidebar">
          <h1 className="library-title">My Library</h1>
          <button className="add-movie-button" onClick={() => setIsAddingMovie(true)}>+ Add Movie</button>
          {/* --- TEMPORARY MIGRATION BUTTON --- */}
          <nav>
            <ul>
              {categories.map((category) => (
                <li key={category}>
                  <button className={!isSearching && selectedCategory === category ? 'active' : ''} onClick={() => handleCategorySelect(category)}>
                    {category.replace(/_/g, ' ')}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main className="movie-grid-container">
          <header className="grid-header">
            <h2>{isSearching ? 'Search Results' : (selectedCategory?.replace(/_/g, ' ') || '')}</h2>
            <div className="controls-container">
              <div className="sort-options"><select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}><option value="year-desc">Year (Newest)</option><option value="year-asc">Year (Oldest)</option><option value="alpha-asc">Alphabetical (A-Z)</option></select></div>
              <div className="search-bar"><input type="text" placeholder="Search all movies..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
            </div>
          </header>
          {isSearching ? (searchResultCategories.length > 0 ? (searchResultCategories.map(category => (<div key={category}><h3 className="search-category-title">{category}</h3><motion.div className="movie-grid">{sortMovies(filteredMovies[category]).map(renderMovieCard)}</motion.div></div>))) : <p>No movies found for "{searchTerm}"</p>) : (<motion.div key={selectedCategory + sortOrder} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="movie-grid">{sortMovies(moviesByCategory[selectedCategory]).map(renderMovieCard)}</motion.div>)}
        </main>
      </div>
    </>
  );
}
export default Library;
