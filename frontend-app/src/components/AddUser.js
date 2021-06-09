import React, { useState } from 'react';
import {
    Modal,
    TextInput,
    Form,
    Toggle,
    Button,
} from 'carbon-components-react';
import axios from 'axios';
import "./AddUser.scss"

const AddUser = ({ open, onClose }) => {
    const userState = {
        email: '',
        first_name: '',
        last_name: '',
        username: '',
        is_superuser: false,
        is_staff: false,
        is_active: false
    }
    const [state, setState] = useState(userState);
    const handleSubmit = async () => {
        const data = await axios.post('http://127.0.0.1:8000/create', state)
        onClose();
    }
    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value })
    }
    const handelToggle = (e, name) => {
        setState({ ...state, [name]: e })
    }

    return (
        <Modal
            open={open}
            className="add-modal"
            modalHeading="Add New User"
            onClose={onClose}
            onRequestClose={onClose}
            passiveModal
        >
            <Form onSubmit={handleSubmit}>
                <TextInput
                    data-modal-primary-focus
                    id="email"
                    labelText="Email"
                    style={{ marginBottom: '1rem' }}
                    name="email"
                    required
                    onChange={handleChange}
                    value={state.email}
                    required
                />
                <TextInput
                    data-modal-primary-focus
                    id="first_name"
                    labelText="First Name"
                    style={{ marginBottom: '1rem' }}
                    name="first_name"
                    required
                    onChange={handleChange}
                    value={state.first_name}
                    required
                />
                <TextInput
                    data-modal-primary-focus
                    id="lastt_name"
                    labelText="Last Name"
                    style={{ marginBottom: '1rem' }}
                    name="last_name"
                    required
                    onChange={handleChange}
                    value={state.last_name}
                    required
                />
                <TextInput
                    data-modal-primary-focus
                    id="userName"
                    labelText="User Name"
                    style={{ marginBottom: '1rem' }}
                    name="username"
                    required
                    onChange={handleChange}
                    value={state.username}
                    required
                />
                <Toggle labelText="Is Super User?" id="isSupperUser" labelA={"No"} labelB={"Yes"} style={{ paddingBottom: '1rem' }} name="is_superuser" onToggle={(e) => handelToggle(e, 'is_superuser')} value={state.is_superuser} />
                <Toggle labelText="Is Staff?" id="isStaff" labelA={"No"} labelB={"Yes"} style={{ paddingBottom: '1rem' }} name="is_staff" onToggle={(e) => handelToggle(e, 'is_staff')} value={state.is_staff} />
                <Toggle labelText="Is Active?" id="isActive" labelA={"No"} labelB={"Yes"} style={{ paddingBottom: '1rem' }} name="is_active" onToggle={(e) => handelToggle(e, 'is_active')} value={state.is_active} />
                <Button type="submit" className="some-class">
                    Submit
                </Button>
            </Form>
        </Modal>
    )
}

export default AddUser;