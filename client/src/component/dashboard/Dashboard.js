import React, { Fragment, useEffect } from 'react';
import PropsTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';
import Spinner from '../layout/spinner';
import { Link } from 'react-router-dom';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';


const Dashboard = ({
    getCurrentProfile, auth: { user },
    deleteAccount,
    profile: { profile, loading }
}) => {
    useEffect(() => {
        getCurrentProfile();
    }, [getCurrentProfile]);

    return loading && profile === null ? (<Spinner />) :
        (<Fragment>
            <h1 className='large text-primary'>Dashboard</h1>
            <p className='lead'>
                <i className='fas fa-user' /> Welcome {user && user.name}
            </p>
            { profile !== null ? (
                <Fragment>
                    <DashboardActions/>
                    <Experience experience={profile.experience} />
                    <Education education={profile.education} />

                    <div className="my-2">
                        <button className="btn btn-danger" onClick={() => deleteAccount()}>
                            <i className="fas fa-user-minus"></i> Delete My Account
                        </button>
                    </div>
                </Fragment>) :
                (<Fragment>
                    <p>You have not yet setup a profile, please add same info</p>
                    <Link to='/create-profile' className='btn btn-primary my-1'>
                        Create Profile
                </Link>
                </Fragment>)}
        </Fragment>);

};


Dashboard.propTypes = {
    getCurrentProfile: PropsTypes.func.isRequired,
    auth: PropsTypes.object.isRequired,
    profile: PropsTypes.object.isRequired,
    deleteAccount: PropsTypes.func.isRequired
};

const mapToStateProps = state => ({
    auth: state.auth,
    profile: state.profile
})


export default connect(mapToStateProps, { getCurrentProfile,deleteAccount })(Dashboard);
