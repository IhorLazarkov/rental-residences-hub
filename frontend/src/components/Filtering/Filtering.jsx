import { useDispatch, useSelector } from "react-redux";
import "./Filtering.css"
import { useEffect, useState } from "react";
import { getFilters } from "../../store/filter";
import { filterSpots } from "../../store/spots";

export default function Filtering() {
    const dispatch = useDispatch()
    const filters = useSelector(state => state.filters)
    const [isLoaded, setLoaded] = useState(false)
    const [countries, setCountries] = useState([])
    const [cities, setCities] = useState([])

    //filter
    const [country, setCountry] = useState('')
    const [city, setCity] = useState('')
    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(1000)

    const selectCountry = (e) => setCountry(e.target.value)
    const selectCity = (e) => setCity(e.target.value)

    useEffect(() => {
        dispatch(getFilters()).then(() => {
            setLoaded(true)
        })
    }, [dispatch])

    useEffect(() => {
        filters.cities && setCities(filters.cities)
        filters.countries && setCountries(filters.countries)
    }, [Object.values(filters).length])

    useEffect(() => {
        const filter = {}
        if (city) filter.city = city;
        if (country) filter.country = country;
        if (minPrice) filter.minPrice = parseInt(minPrice);
        if (maxPrice) filter.maxPrice = parseInt(maxPrice);
        dispatch(filterSpots(filter)).then(() => setLoaded(true))
    }, [city, country, minPrice, maxPrice])

    const onReset = () => {
        setLoaded(false)
        setCity('')
        setCountry('')
        setMinPrice(0)
        setMaxPrice(1000)
        dispatch(filterSpots({})).then(() => setLoaded(true))
    }

    return (
        <main>
            {!isLoaded
                ? <h3>Loading...</h3>
                : <div id="filtering">
                    <label htmlFor="country">Country</label>
                    <select id="country" onChange={selectCountry}>
                        <option value="" defaultValue="">empty</option>
                        {countries && countries.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <label htmlFor="city">City</label>
                    <select id="city" onChange={selectCity}>
                        <option value="" defaultValue="">empty</option>
                        {cities && cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <section style={{ display: "flex", gap: "10px" }}>
                        <label htmlFor="from">Price range</label>
                        <input type="number" name="from" id="from" minLength={0} value={minPrice} onChange={e => setMinPrice(e.target.value)} />
                        -
                        <input type="number" name="to" id="to" minLength={0} value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
                    </section>
                    <button onClick={onReset} className="secondary">reset</button>
                </div>
            }
        </main>
    );
}
