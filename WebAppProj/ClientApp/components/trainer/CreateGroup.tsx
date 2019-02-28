import * as React from 'react';
import { RouteComponentProps } from 'react-router';
//import { AuthStore } from '../stores/AuthStore/AuthStore';
import { inject, observer } from 'mobx-react';
import { TrainerStore } from '../../stores/TrainerStore/TrainerStore';

interface Props extends RouteComponentProps<any>, React.Props<any> {
    trainerStore: TrainerStore
}

//TODO: Move to groupstore.
@inject('trainerStore')
@observer
export class CreateGroup extends React.Component<Props> {
    public render() {
        return <div className="page">
            <div className='page-header'>
                <h1>This is the create group page.</h1>
            </div>
            <div className='page-content'>
                <p>Create a group.</p>
                <form onSubmit={this.formSubmit}>
                    <label htmlFor='groupname'>Group name: </label>
                    <input
                        className="textbox"
                        id='groupname'
                        type='text'
                        placeholder='Group name'
                        autoComplete='off'
                        required
                        onChange={this.onGroupNameChange}

                    />
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
        let groupCreated = await this.props.trainerStore.createGroup();

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

        this.props.trainerStore.onGroupnameChange(groupName);
    }
}
