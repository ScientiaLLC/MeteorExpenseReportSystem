import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import UserDashboardPage from '../pages/userDashboard.jsx';

/* global Requests Projects:true*/
/* eslint no-undef: "error"*/

const UserDashboardContainer = createContainer(() => {
  const user = Meteor.user();
  const profile = user && user.profile;
  const isAdmin = profile && profile.isAdmin;
  const name = profile && profile.name;

  // Subscriptions
  const projectSub = Meteor.subscribe('projects');
  const requestSub = Meteor.subscribe('requests');
  let userNameSub = null;
  let projectNameSub = null;

  // Subscription ready
  const projectReady = projectSub.ready();
  const requestReady = requestSub.ready();
  let userReady = null;
  let projectNameReady = null;

  // Projects and Requests
  let employeeProjects = [];
  if (isAdmin && projectReady) {
    employeeProjects = Projects.find().fetch();
  } else if (user && projectReady) {
    employeeProjects = Projects.find({ employees: user._id }).fetch();
  }
  let managerProjects = [];
  if (isAdmin && projectReady) {
    managerProjects = Projects.find().fetch();
  } else {
    managerProjects = (user && projectReady && Projects.find({ managers: user._id }).fetch()) || [];
  }
  const myRequests = (requestReady && user &&
    Requests.find({ userId: user._id, submitted: false }).fetch()) || [];
  const managerIds = [];
  if (managerProjects) {
    for (let i = 0; i < managerProjects.length; i += 1) {
      managerIds.push(managerProjects[i]._id);
    }
  }
  const managerRequests = (requestReady && user &&
    Requests.find({ projectId: { $in: managerIds },
      $or: [{ status: { $exists: false } }, { status: null }] }).fetch()) || [];
  const requestUserIds = requestReady &&
    Requests.find({}, { fields: { userId: 1 } }).fetch();
  let users = [];
  if (requestUserIds) {
    userNameSub = Meteor.subscribe('usersNames', requestUserIds);
    userReady = userNameSub.ready();
    users = (userReady && Meteor.users.find().fetch()) || [];
  }
  const requestProjectIds = requestReady &&
    Requests.find({}, { fields: { projectId: 1 } }).fetch();
  let projectNames = [];
  if (requestProjectIds) {
    projectNameSub = Meteor.subscribe('projectNames', requestProjectIds);
    projectNameReady = projectNameSub.ready();
    projectNames = (projectNameReady && Projects.find().fetch()) || [];
  }

  // Helper props
  const isEmployee = employeeProjects && employeeProjects.length > 0;
  const isManager = managerProjects && managerProjects.length > 0;

  // Breadcrumbs
  const breadcrumbs = [
    {
      page: 'User Dashboard',
      url: '/#/dashboard',
    },
  ];

  return {
    breadcrumbs,
    user: !!user || false,
    isAdmin,
    name,
    employeeProjects,
    managerProjects,
    myRequests,
    managerRequests,
    users,
    projectNames,
    isManager,
    isEmployee,
  };
}, UserDashboardPage);

module.exports = UserDashboardContainer;
