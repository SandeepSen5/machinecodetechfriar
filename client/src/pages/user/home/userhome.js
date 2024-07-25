import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from "./home.module.css";
import { FaSearch } from "react-icons/fa";
import CustomMarks from '../../../components/user/slider';

export default function Userhome() {

    const [vehicles, setVehicles] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 368000]);

    useEffect(() => {
        async function getData() {
            try {
                const { data } = await axios.get("/admin/vehicles");
                setVehicles(data);
                setFilteredVehicles(data);
            } catch (err) {
                console.log(err);
            }
        }
        getData();
    }, []);

    useEffect(() => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        const filtered = vehicles.filter(vehicle =>
            (vehicle.name.toLowerCase().includes(lowerCaseQuery) ||
                vehicle.manufacturer?.toLowerCase().includes(lowerCaseQuery) ||
                vehicle.model.toLowerCase().includes(lowerCaseQuery)) &&
            (vehicle.price >= priceRange[0] && vehicle.price <= priceRange[1])
        );
        setFilteredVehicles(filtered);
    }, [searchQuery, vehicles, priceRange]);

    return (
        <div className={styles.container}>
            <div className={styles.searchAndSlider}>
                <div className={styles.searchdiv}>
                    <input
                        className={styles.searchInput}
                        type="text"
                        placeholder="Search By Vehicle"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                    <div className={styles.searchicon}><FaSearch /></div>
                </div>
                <div className={styles.sliderContainer}>
                    <span className={styles.sliderLabel}>Price Slider</span>
                    <CustomMarks priceRange={priceRange} setPriceRange={setPriceRange} />
                </div>
            </div>

            <div className={styles.vehiclecards}>
                {filteredVehicles.length > 0 &&
                    filteredVehicles.map((item) => (
                        <div key={item.id} className={styles.card}>
                            <img className={styles.cardImage} src={"http://localhost:4000/uploads/" + item.image} alt={item.name} />
                            <h2 className={styles.cardName}>{item.name}</h2>
                            <h3 className={styles.cardPrice}>₹{item.price}</h3>
                        </div>
                    ))}
            </div>
        </div>
    );
}
