import React from 'react';
import { connect } from 'react-redux';
import CONSTANTS from '../../constants';
import CustomerDashboard from '../../components/CustomerDashboard/CustomerDashboard';
import CreatorDashboard from '../../components/CreatorDashboard/CreatorDashboard';
import ModeratorDashboard from '../../components/ModeratorDashboard/ModeratorDashboard';
import Header from '../../components/Header/Header';

const dashboardComponents = {
  [CONSTANTS.CUSTOMER]: CustomerDashboard,
  [CONSTANTS.CREATOR]: CreatorDashboard,
  [CONSTANTS.MODERATOR]: ModeratorDashboard,
};

const Dashboard = (props) => {
  const { role, history, match } = props;
  const DashboardComponent = dashboardComponents[role] || (() => <div>No dashboard available</div>);

  return (
    <div>
      <Header />
      <DashboardComponent history={history} match={match} />
    </div>
  );
};

const mapStateToProps = (state) => state.userStore.data;

export default connect(mapStateToProps)(Dashboard);
