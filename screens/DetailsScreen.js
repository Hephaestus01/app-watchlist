import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useContext } from 'react';
import { WatchListContext } from '../contexts/WatchListContext';

export default function DetailsScreen({ route }) {
  const [movie, setMovie] = useState(null);
  const [isSaved, setIsSaved] = useState(false); // Add this line
  const movieId = route.params.movieId;
  const { addToWatchList, removeFromWatchList, watchList } =
    useContext(WatchListContext);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=70e3c8b4ed316240a366de839cbf765d`
        );
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  // Add this useEffect
  useEffect(() => {
    setIsSaved(watchList.some((item) => item.id === movieId));
  }, [watchList, movieId]);

  if (!movie) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const handleSaveButtonClick = () => {
    if (isSaved) {
      removeFromWatchList(movie.id);
      setIsSaved(false);
    } else {
      addToWatchList(movie);
      setIsSaved(true);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{
          uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.releaseDate}>
          Release Date: {movie.release_date}
        </Text>
        <Text style={styles.overview}>{movie.overview}</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveButtonClick}>
          <Text style={styles.saveButtonText}>
            {isSaved ? 'Remove from WatchList' : 'Save to WatchList'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c2b',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#1c1c2b',
  },
  detailsContainer: {
    padding: 20,
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  releaseDate: {
    color: '#ffffff',
    fontSize: 18,
    marginBottom: 10,
  },
  overview: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#00adb5',
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 18,
  },
});
