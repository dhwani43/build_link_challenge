import React, { useState,useEffect } from 'react';
import {
    Modal,
} from 'carbon-components-react';
import axios from 'axios';
import './ViewUser.scss';

const ViewUser = ({ open,onClose,userID }) => {
    const [userData, setuserData] = useState([]);

    const userViewData = {
        email:'Email',
        first_name:'First Name',
        last_name:'Last Name',
        username:'User Name',
        is_superuser:'Is SuperUser',
        is_staff:'Is Staff',
        is_active:'Is Active'
    }

    const getUserData = async() => {
        const {data} = await axios.get('http://127.0.0.1:8000/details')
        if(data) {
            const newData = data.filter(item => item.id === userID);
            setuserData(newData)
        }
    }

    useEffect(()=> {
        getUserData()
      }, [open]);

    return (
        <Modal
            open={open}
            modalHeading="View User"
            onClose={onClose}
            onRequestClose={onClose}
            passiveModal
            className="view-modal"
        >
            <div class="bx--grid">
            {
                userData[0] && Object.entries(userData[0]).map(([key,value]) => {
                    return userViewData[key] && 
                    <div className="bx--row rowdata">
                      <div className="bx--col heading">{userViewData[key]}</div>
                      <div className="bx--col detaildata">{value.toString()}</div>
                    </div>
                })
            }
           </div>
        </Modal>
    )
}

export default ViewUser;