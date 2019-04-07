import * as React from 'react';
import { RouteComponentProps } from 'react-router';
//import { AuthStore } from '../stores/AuthStore/AuthStore';
import { inject, observer } from 'mobx-react';
import { GroupStore } from '../../stores/GroupStore/GroupStore';
import Helmet from 'react-helmet';

interface Props extends RouteComponentProps<any>, React.Props<any> {
    groupStore: GroupStore
}

@inject('groupStore')
@observer
export class CreateGroup extends React.Component<Props> {
    public render() {
        return <div className='page create-group-page'>
            <Helmet>
                <title>Create - Training App</title>
                <meta name='description' content='Create a new group.' />
            </Helmet>

            <div className='page-header'>
                <h1>Create a group</h1>
            </div>
            <div className='page-content'>
                <form onSubmit={this.formSubmit}>
                    <div className='form-group'>
                        <label htmlFor='groupname'>Group name: </label>
                        <input
                            className='textbox form-control'
                            id='groupname'
                            type='text'
                            placeholder='Group name'
                            autoComplete='off'
                            required
                            onChange={this.onGroupNameChange}
                        />
                    </div>

                    <button className='btn btn-primary strd-btn create-group-button'
                        onClick={
                            this.createGroup
                        }
                    > Create group
                </button>
                </form>
            </div>
        </div>;
    }

    private formSubmit = (e: any) => {
        e.preventDefault();
    }

    private createGroup = async (e: any) => {
        let groupCreated = await this.props.groupStore.createGroup();

        //Prevent the page from refreshing when the form is submitted
        e.preventDefault();

        if (groupCreated) {
            this.props.history.push('/mygroup');
            alert("Your group has been created.");
        } else {
            return false;
        }
    }

    private onGroupNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let groupName = e.target.value;

        this.props.groupStore.onGroupnameChange(groupName);
    }
}
