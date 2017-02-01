import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import AdminDashboardPage from '../pages/adminDashboard.jsx';

/* global Projects Reports:true*/
/* eslint no-undef: "error"*/

const AdminDashboardContainer = createContainer(() => {
  const user = Meteor.user();
  const profile = user && user.profile;
  const isAdmin = profile && profile.isAdmin;

  const projectSub = Meteor.subscribe('projects');
  const projectReady = projectSub.ready();
  const projects = projectReady && Projects.find().fetch();

  const userSub = Meteor.subscribe('users');
  const userReady = userSub.ready();
  const users = userReady && Meteor.users.find().fetch();

  const reportSub = Meteor.subscribe('reports');
  const reportReady = reportSub.ready();
  const reports = reportReady && Reports.find().fetch();
  return {
    user: !!user || false,
    isAdmin,
    projectReady,
    userReady,
    reportReady,
    projects: projects || [],
    users: users || [],
    reports: reports || [],
  };
}, AdminDashboardPage);

module.exports = AdminDashboardContainer;
