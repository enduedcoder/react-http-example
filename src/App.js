import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import AddMovie from "./components/AddMovie";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorData, setErrorData] = useState("");

  // const fetchMoviesHandler = () => {
  //   fetch("https://swapi.dev/api/films")
  //     .then((data) => {
  //       return data.json();
  //     })
  //     .then((data) => {
  //       const formattedData = data.results.map((movie) => {
  //         return {
  //           id: movie.id,
  //           title: movie.title,
  //           releaseDate: movie.release_date,
  //           openingText: movie.opening_crawl,
  //         };
  //       });

  //       setMovies(formattedData);
  //     });
  // };

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://react-http-52a26-default-rtdb.firebaseio.com/movies.json"
      );

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const data = await response.json();
      console.log(data);
      let loadMovies = [];
      for (let property in data) {
        loadMovies.push({
          id: property,
          title: data[property].title,
          releaseDate: data[property].releaseDate,
          openingText: data[property].openingText,
        });
      }

      const formattedData = await loadMovies.map((movie) => {
        return {
          id: movie.id,
          title: movie.title,
          releaseDate: movie.release_date,
          openingText: movie.opening_crawl,
        };
      });

      setMovies(formattedData);
    } catch (error) {
      setErrorData(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  async function onAddMovieHandler(newMovie) {
    const response = await fetch(
      "https://react-http-52a26-default-rtdb.firebaseio.com/movies.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMovie),
      }
    );

    const data = await response.json();
    console.log(data);
  }

  let content;
  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (movies.length === 0) {
    content = <p>No movies found!</p>;
  }

  if (errorData) {
    content = errorData;
  }

  if (isLoading) {
    content = <p>Loading..</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={onAddMovieHandler}></AddMovie>
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
