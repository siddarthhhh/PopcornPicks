import { useState, useEffect } from 'react'
import { useDebounce } from 'react-use'
import './App.css'
import './index.css'
import { updateSearchCount, getTrendingMovies } from './appwrite.js'

import Search from './components/Search.jsx'
import Spinner from './components/Spinner.jsx'
import MovieCard from './components/MovieCard.jsx'

const API_BASE_URL = "https://api.themoviedb.org/3"
const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const API_OPTIONS = {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  }
}

const App = () => {
  const [SearchTerm, setSearchTerm] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [movieList, setMovieList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [trendingMovies, setTrendingMovies] = useState([])

  // const [debounceSearchTerm,setDebounceSearchTerm]=useState('')

  // ✅ Debounce fetchMovies
  useDebounce(() => {
    fetchMovies(SearchTerm)
  }, 500, [SearchTerm])

  useEffect(() => {
    loadTrendingMovies();
  }, [])

  const fetchMovies = async (query) => {
    try {
      setIsLoading(true)
      setErrorMessage('')

      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`

      const response = await fetch(endpoint, API_OPTIONS)

      if (!response.ok) {
        throw new Error("failed to fetch new movies")
      }

      const data = await response.json()
      if (data.Response === 'False') {
        setErrorMessage(data.Error || "failed to fetch movies")
        setMovieList([])
        return
      }

      setMovieList(data.results || [])

      if(query && data.results.length > 0){
        await updateSearchCount(query, data.results[0]);
      }

    } catch (error) {
      console.log(error)
      setErrorMessage('error fetching movies')
    } finally {
      setIsLoading(false)
    }
  }

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  }

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero-img.png" alt="hero banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> you'll enjoy
          </h1>
          <Search SearchTerm={SearchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2 className="mt-40px">All movies</h2>

          {/* {errorMessage && <p className="text-red-500">{errorMessage}</p>} */}

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

// const Card_comp=(props)=>{

//   const [count,setCount]=useState(0)
//   const [hasLiked,setHasLiked]=useState(false);
//   useEffect(() => {console.log(  `${props.name} is being ${hasLiked}` )}, [hasLiked,count])

//   return(
//         <div className='card' onClick={()=>setCount(count+1)} >
//           <h2>{props.name} {count?count:null}</h2>
//           <button onClick={()=> setHasLiked(!hasLiked)}>
//                     {hasLiked?"Liked":"Like"}
//           </button>
//         </div>
//   )
// }

export default App