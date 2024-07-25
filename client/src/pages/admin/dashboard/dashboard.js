import React, { useContext, useState, useEffect } from 'react';
import { AdminContext } from '../../../store/adminContext';
import Header from '../../../components/admin/header';
import styles from "./dashboard.module.css";
import VehicleDatatable from '../../../components/admin/BookingTable';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminDashboard() {
    const { user } = useContext(AdminContext);
    const [name, setName] = useState('');
    const [vehicles, setVehicles] = useState([]);
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [model, setModel] = useState('');
    const [image, setImage] = useState(null);
    const [update, setUpdate] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();



    useEffect(() => {

        console.log('Users:', user);

        if (!user) {
            callusercheck();
        }

        if (id) {
            axios.get(`/admin/editvehicle/${id}`)
                .then((response) => {
                    const vehicle = response.data;
                    setName(vehicle.name);
                    setDescription(vehicle.description);
                    setPrice(vehicle.price);
                    setModel(vehicle.model);
                    setImage(vehicle.image);
                })
                .catch((error) => {
                    console.error('Error fetching vehicle details:', error);
                });
        }

        axios.get("/admin/vehicles")
            .then(({ data }) => {
                const formattedVehicles = data.map((vehicle, index) => ({
                    id: index + 1,
                    keyid: vehicle._id,
                    title: vehicle.name,
                    description: vehicle.description,
                    price: vehicle.price,
                    model: vehicle.model,
                }));
                setVehicles(formattedVehicles);
            })
            .catch((error) => {
                console.error("Error fetching vehicle data:", error);
            });

    }, [id, update, user, navigate]);

    const callusercheck = () => {

        setTimeout(() => {
            if (!user) {
                console.log('Navigating to /admin'); // Debug navigation call
                navigate("/admin/login");
            }
        }, 3000);
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('model', model);
        if (image) {
            formData.append('image', image);
        }

        try {
            if (id) {

                await axios.patch(`/admin/updatevehicle/${id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log('Vehicle updated successfully');
            } else {
                // Add new vehicle
                await axios.post('/admin/vehicles', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log('Vehicle added successfully');
            }
            setName('');
            setDescription('');
            setPrice('');
            setModel('');
            setImage(null);
            setUpdate((prev) => !prev);
            navigate('/admin');
        } catch (error) {
            console.error('Error saving vehicle:', error);
        }
    };

    return (
        <div>
            <Header />
            <div className={styles.dashboardmain}>
                <div className={styles.dashboardheader}>
                    <h5>{id ? 'Edit Vehicle' : 'Add Vehicle'}</h5>
                </div>
                <div className={styles.formfields}>
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div>
                            <label htmlFor="name">Name:</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="description">Description:</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="price">Price:</label>
                            <input
                                type="number"
                                id="price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="model">Model:</label>
                            <input
                                type="text"
                                id="model"
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="image">Image:</label>
                            <input
                                type="file"
                                id="image"
                                onChange={handleImageChange}
                            />
                        </div>
                        <button type="submit">{id ? 'Update Vehicle' : 'Add Vehicle'}</button>
                    </form>
                </div>
                <div style={{ marginTop: "10px" }}>
                    <VehicleDatatable rows={vehicles} setUpdate={setUpdate} />
                </div>
            </div>
        </div>
    );
}
