"use client";
import withAuth from "../hoc/withAuth";
import Link from "next/link";
const containerStyle = {
	maxWidth: '800px',
	margin: '0 auto',
	padding: '20px',
  };
  
  const headingStyle = {
	color: '#333',
  };
  
  const paragraphStyle = {
	lineHeight: '1.6',
  };
  
  const upcomingActivitiesStyle = {
	marginTop: '20px',
  };
  
  const upcomingActivitiesHeaderStyle = {
	color: '#333',
  };
  
  const upcomingActivitiesListStyle = {
	listStyle: 'none',
	padding: '0',
  };
  
  const upcomingActivitiesItemStyle = {
	marginBottom: '20px',
  };
  
  const upcomingActivitiesLinkStyle = {
	color: '#0070f3',
	textDecoration: 'none',
	fontWeight: 'bold',
  };
  
  const upcomingActivitiesLinkHoverStyle = {
	textDecoration: 'underline',
  };
  
  const UpcomingActivities = () => (
	<div style={upcomingActivitiesStyle}>
	  <h2 style={upcomingActivitiesHeaderStyle}>Upcoming Activities</h2>
	  <ul style={upcomingActivitiesListStyle}>
		<li style={upcomingActivitiesItemStyle}>
		  <strong>Event Title 1</strong> - Date/Time
		  <p>Description of the event.</p>
		</li>
		<li style={upcomingActivitiesItemStyle}>
		  <strong>Event Title 2</strong> - Date/Time
		  <p>Description of the event.</p>
		</li>
		<li style={upcomingActivitiesItemStyle}>
		  <strong>Event Title 3</strong> - Date/Time
		  <p>Description of the event.</p>
		</li>
	  </ul>
	  {/* <Link href="/activities">
		<a style={upcomingActivitiesLinkStyle}>View All Upcoming Activities</a>
	  </Link> */}
	</div>
  );
  
  const Home = () => (
	<div style={containerStyle}>
	  <h1 style={headingStyle}>Welcome to Big At Heart</h1>
	  <p style={paragraphStyle}>
		Big At Heart is a Non-Profit Social Service Organization inspiring GIVING
		through Volunteering, Donations-in-kind, and Fundraising. We help match
		volunteers and donors to curated causes, specifically those working for
		Children, Women, and Low Income communities. We create custom giving
		projects or connect you to existing causes that you can get involved in.
	  </p>
	  <p style={paragraphStyle}>
		Join us and start your giving journey in a fun, easy, and fulfilling way.
		Come find your volunasia with us!
	  </p>
	  <p style={paragraphStyle}>
		"VOLUNASIA is that moment when you forget you're volunteering to help
		change lives because it's changing yours."
	  </p>
	  <h2>Mission</h2>
	  <p style={paragraphStyle}>
		Big At Heart is a Non-Profit Service Organization inspiring GIVING through
		Volunteering, Donations-in-kind, and Fundraising. We help match givers to
		curated causes. We also create custom giving projects or connect
		volunteers to existing causes that they can get involved in. We make the
		journey easy for the givers so that they taste the quintessential
		fulfillment which inspires them to keep giving. It becomes their
		volunasia, and the society has a giver for life.
	  </p>
	  <UpcomingActivities />
	</div>
  );

export default withAuth(Home);
