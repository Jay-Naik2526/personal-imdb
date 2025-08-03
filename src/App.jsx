import React, { useState, useMemo, useEffect } from 'react';
// --- NEW: Import deleteDoc and doc ---
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase'; // Import your Firebase config
import Library from './Library';
import MovieDetail from './MovieDetail';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onSnapshot(collection(db, 'movies'), (snapshot) => {
      const moviesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMovies(moviesData);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAddMovie = async (newMovie) => {
    try {
      await addDoc(collection(db, 'movies'), newMovie);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // --- NEW: Function to delete a movie from Firebase ---
  const handleDeleteMovie = async (movieId) => {
    try {
      await deleteDoc(doc(db, 'movies', movieId));
      // After deleting, go back to the library view
      setSelectedMovie(null);
    } catch (e) {
      console.error("Error removing document: ", e);
    }
  };

  const moviesByCategory = useMemo(() => {
    return movies.reduce((acc, movie) => {
      const category = movie.category || 'Uncategorized';
      if (!acc[category]) acc[category] = [];
      acc[category].push(movie);
      return acc;
    }, {});
  }, [movies]);

  const categories = Object.keys(moviesByCategory).sort();

  useEffect(() => {
    if (!selectedCategory && categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  const filteredMovies = useMemo(() => {
    if (!searchTerm) return moviesByCategory;
    const allMovies = movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return allMovies.reduce((acc, movie) => {
      const category = movie.category || 'Uncategorized';
      if (!acc[category]) acc[category] = [];
      acc[category].push(movie);
      return acc;
    }, {});
  }, [searchTerm, movies, moviesByCategory]);

  if (isLoading) {
    return <div className="loading-screen"><h1>Loading Library...</h1></div>;
  }

  return (
    <div className="app-container">
      {selectedMovie ? (
        <MovieDetail 
          movie={selectedMovie} 
          onGoBack={() => setSelectedMovie(null)}
          onDeleteMovie={handleDeleteMovie} // Pass the delete function
        />
      ) : (
        <Library
          categories={categories}
          moviesByCategory={moviesByCategory}
          filteredMovies={filteredMovies}
          onSelectMovie={setSelectedMovie}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onAddMovie={handleAddMovie}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      )}
    </div>
  );
}

export default App;