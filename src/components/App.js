import React,{useState,useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";
import LogItem from "./LogItem";
import AddLog from "./AddLog";
import {ipcRenderer} from 'electron';

const App = () => {
	const [logs,setLogs] = useState([]);
	const [alert,setAlert] = useState({
		show: false,
		message: '',
		variant: 'success'
	});
	useEffect(() => {
		ipcRenderer.send('logs:load');
		ipcRenderer.on('logs:get',(e,logs)=>{
			setLogs(JSON.parse(logs))
		});
		ipcRenderer.on('logs:added',(e,logs) => {
			setLogs(JSON.parse(logs))
		});
		ipcRenderer.on('logs:deleted',(e,logs) => {
			setLogs(JSON.parse(logs))
		});
	},[]);

	const addLog = (item) => {
		ipcRenderer.send('logs:add',JSON.stringify(item));
	};
	const deleteItem = (id) => {
		ipcRenderer.send('logs:delete',id);
	};
	const alertHandler = () => {
		setAlert({
			show: true,
			message: 'log added',
			variant: 'success'
		});

		setTimeout(() => {
			setAlert({
				show: false,
				message: '',
				variant: 'success'
			});
		},3000)
	};
	return (
		<Container>
			<AddLog onAdd={addLog} onAlert={alertHandler}/>
			<br/>
				{alert.show ? <Alert variant={alert.variant}>{alert.message}</Alert> : <div> </div>}
			<br/>
			<Table>
				<thead>
					<tr>
						<th>Priority</th>
						<th>Log text</th>
						<th>Users</th>
						<th>Created</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
				{logs.map(log => {
					return(
						<LogItem log={log} key={log._id} onDelete={deleteItem}/>
					)
				})}
				</tbody>
			</Table>
		</Container>
	)
};

export default App
