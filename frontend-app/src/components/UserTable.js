import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckmarkFilled32, CloseOutline32, TrashCan32, CheckmarkOutline32, PauseOutline32, Download32, AddAlt32, OverflowMenuHorizontal32 } from '@carbon/icons-react';

import {
  Button,
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableSelectAll,
  TableSelectRow,
  TableToolbar,
  TableBatchAction,
  TableBatchActions,
  TableToolbarSearch,
  TableToolbarContent,
} from 'carbon-components-react';
import { ExportToCsv } from 'export-to-csv';
import AddUser from './AddUser';
import ViewUser from './viewUser';
import './ViewUser.scss';

const UserTable = () => {
  const [userData, setuserData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openViewModal, setViewOpenModal] = useState(false);
  const [viewId, setViewId] = useState('');

  const headers = [
    {
      key: 'name',
      header: 'Name',
    },
    {
      key: 'username',
      header: 'User Name'
    },
    {
      key: 'is_superuser',
      header: 'Super User'
    },
    {
      key: 'is_staff',
      header: 'Staff',
    },
    {
      key: 'is_active',
      header: 'Active',
    },
  ];
  const options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useTextFile: false,
    useBom: true,
  };
  options.filename = "User Data";
  options.headers = headers.map(({ header }) => header);
  const csvExporter = new ExportToCsv(options);

  const getUserData = async () => {
    const { data } = await axios.get('http://127.0.0.1:8000/list')
    if (data) {
      setuserData(data)
    }
  }

  useEffect(() => {
    getUserData()
  }, [openModal]);

  const csvRows = userData.map(row => {
    const newRow = {};
    headers.forEach(({ key, header }) => {
      newRow[key] = row[key] ? row[key] : '';
    });
    return newRow;
  });


  const handleAddRow = () => {
    setOpenModal(true)
  }
  const handleCloseModal = () => {
    setOpenModal(false)
  }
  const handleDelete = async (row) => {
    let selectIDs = row.map(item => item.id)
    const data = await axios.post('http://127.0.0.1:8000/destroy', { ids: selectIDs })
    getUserData()
  }
  const handleActivate = async (row, status) => {
    let selectIDs = row.map(item => item.id)
    const data = await axios.post(`http://127.0.0.1:8000/active-status/${status}`, { ids: selectIDs })
    getUserData()
  }
  const handleView = (row) => {
    setViewOpenModal(true);
    setViewId(row.id);
  }
  const handleViewCloseModal = () => {
    setViewOpenModal(false);
    setViewId('');
  }

  return (
    <>
      <DataTable rows={userData} headers={headers}>
        {({ rows, headers, selectedRows, getTableProps, getToolbarProps, getBatchActionProps, onInputChange, getHeaderProps, getRowProps, getSelectionProps, getTableContainerProps }) => (
          <TableContainer
            title="Users"
            {...getTableContainerProps()}
            className="table-title"
          >
            <TableToolbar {...getToolbarProps()}>
              <TableBatchActions {...getBatchActionProps()}>
                <TableBatchAction
                  tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                  renderIcon={TrashCan32}
                  onClick={() => handleDelete(selectedRows)}
                >
                  Delete
                </TableBatchAction>
                <TableBatchAction
                  tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                  renderIcon={CheckmarkOutline32}
                  onClick={() => handleActivate(selectedRows, 'activate')}
                >
                  Activate
                </TableBatchAction>
                <TableBatchAction
                  tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                  renderIcon={PauseOutline32}
                  onClick={() => handleActivate(selectedRows, 'deactivate')}
                >
                  Deactivate
                </TableBatchAction>
              </TableBatchActions>
              <TableToolbarContent>
                <TableToolbarSearch
                  persistent={true}
                  tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                  onChange={onInputChange}
                />
                <Button
                  tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                  renderIcon={Download32}
                  onClick={() => csvExporter.generateCsv(csvRows)}
                  iconDescription="Download as CSV"
                  hasIconOnly
                  kind="ghost"
                />
                <Button
                  tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                  onClick={handleAddRow}
                  size="small"
                  kind="primary"
                  renderIcon={AddAlt32}
                >
                  Add new
                </Button>
              </TableToolbarContent>
            </TableToolbar>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  <TableSelectAll {...getSelectionProps()} />
                  {headers.map((header, i) => (
                    <TableHeader key={i} {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                  <TableHeader />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, i) => (
                  <TableRow key={i} {...getRowProps({ row })}>
                    <TableSelectRow {...getSelectionProps({ row })} />
                    {row.cells.map((cell) => {
                      return <TableCell key={cell.id}>{
                        cell.value.toString() === "true" ?
                          <CheckmarkFilled32 className="check-mark" /> : cell.value.toString() === "false" ? <CloseOutline32 className="close-icon" /> : cell.value
                      }</TableCell>
                    })}
                    <TableCell style={{ width: '5%' }}>
                      <Button
                        tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                        renderIcon={OverflowMenuHorizontal32}
                        onClick={() => handleView(row)}
                        iconDescription="View"
                        hasIconOnly
                        kind="ghost"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
      <AddUser open={openModal} onClose={handleCloseModal} />
      <ViewUser open={openViewModal} userID={viewId} onClose={handleViewCloseModal} />
    </>
  )
}

export default UserTable