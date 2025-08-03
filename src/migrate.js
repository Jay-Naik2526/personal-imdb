import { db } from './firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import initialMovies from './movies.json';

export const migrateData = async () => {
  console.log('Starting migration...');

  // 1. Get movies already in Firebase to avoid duplicates
  const querySnapshot = await getDocs(collection(db, 'movies'));
  const existingTitles = new Set(querySnapshot.docs.map(doc => doc.data().title));
  console.log(`${existingTitles.size} movies already in Firebase.`);

  // 2. Get movies from localStorage
  const localMovies = JSON.parse(localStorage.getItem('my-movies') || '[]');
  console.log(`Found ${localMovies.length} movies in localStorage.`);

  // 3. Combine all movies (from JSON and localStorage)
  const allMoviesToUpload = [...initialMovies, ...localMovies];

  // 4. Filter out duplicates and movies already in Firebase
  const uniqueMoviesToUpload = allMoviesToUpload.filter((movie, index, self) => {
    const isDuplicateInList = index !== self.findIndex(m => m.title === movie.title && m.year === movie.year);
    const alreadyInDb = existingTitles.has(movie.title);
    return !isDuplicateInList && !alreadyInDb;
  });

  if (uniqueMoviesToUpload.length === 0) {
    console.log('No new movies to upload. Database is up to date.');
    alert('Your database is already up to date!');
    return;
  }

  console.log(`Uploading ${uniqueMoviesToUpload.length} new unique movies to Firebase...`);
  let successCount = 0;

  // 5. Upload each new movie to Firebase
  for (const movie of uniqueMoviesToUpload) {
    try {
      await addDoc(collection(db, 'movies'), movie);
      successCount++;
    } catch (e) {
      console.error("Error adding document: ", movie.title, e);
    }
  }

  console.log(`Migration complete! Successfully added ${successCount} movies.`);
  alert(`Migration complete! Added ${successCount} new movies to your cloud library.`);
};