import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { CiEdit } from "react-icons/ci";
import { MdBlock } from "react-icons/md";
import { MdDone } from "react-icons/md";
import { MdDelete } from "react-icons/md";

const VehicleDatatable = ({ rows, setUpdate }) => {

    const navigate = useNavigate();

    const deletecategory = (id) => {
        console.log(id, "id");
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/admin/deletevehicle/${id}`)
                    .then((response) => {
                        Swal.fire(
                            'Delete!',
                            'Admin has been Deleted.',
                            'success'
                        )
                        setUpdate((prev) => !prev);
                    })
                    .catch((error) => {
                        Swal.fire(
                            'Failed!',
                            'Admin not Deleted.',
                            'error'
                        )
                    });
            }
        })
    };

    const editVehicle = async (id) => {
        console.log(id);
        await axios.get(`/admin/editvehicle/${id}`)
            .then((response) => {
                console.log(response.data);
                navigate(`/admin/${response.data._id}`);
            })
            .catch((error) => {
                console.error('Error fetching vehicle details:', error);
            });
    };

    console.log(rows, "update")
    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'title', headerName: 'Title', width: 150 },
        { field: 'description', headerName: 'Description', width: 250 },
        { field: 'price', headerName: 'Price', width: 120 },
        { field: 'model', headerName: 'Model', width: 150 },
        {
            field: 'action',
            headerName: 'Action',
            width: 150,
            renderCell: (params) => {
                return (
                    <div style={{ display: "flex", gap: "20px", textAlign: "center", alignItems: "center", alignContent: "center" }}>
                        < div className="view " >
                            <button onClick={(ev) => { deletecategory(params.row.keyid) }} className="bg-red-400 rounded-full" >
                                <MdDelete />
                            </button>
                        </div >
                        <div className="view ">
                            <button onClick={(ev) => { editVehicle(params.row.keyid) }} className="bg-green-500" >
                                <CiEdit />
                            </button>
                        </div>

                    </div >)
            },
        }

    ];

    return (


        <div style={{ height: 500, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                disableRowSelectionOnClick
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
            />
            <ToastContainer />
        </div>


    );
};

export default VehicleDatatable;