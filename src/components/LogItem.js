import React from "react";
import Moment from "react-moment";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";

const LogItem = ({log,onDelete}) => {
    const setVariant = (priority) => {
        if(priority === 'high'){
            return 'danger'
        }else if(priority === 'moderate'){
            return 'warning'
        }else if(priority === 'low'){
            return 'success'
        }
    };
    return(
        <tr>
            <td>
                <Badge variant={setVariant(log.priority)} className='p-2'>
                    {log.priority}
                </Badge>
            </td>
            <td>{log.text}</td>
            <td>{log.user}</td>
            <td>
                <Moment format='MMMM Do YYYY, h:mm:ss a'>
                    {new Date(log.created)}
                </Moment>
            </td>
            <td>
                <Button variant='danger' size='sm' onClick={() => onDelete(log._id)}>x</Button>
            </td>
        </tr>
    )
};

export default LogItem;