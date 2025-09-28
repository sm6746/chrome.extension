import { Connection } from '@/types/connection';

export const mockConnections: Connection[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Chen',
    fullName: 'Sarah Chen',
    profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612c1ee?w=400&h=400&fit=crop&crop=face',
    headline: 'Senior Product Manager at Google',
    currentPosition: 'Senior Product Manager',
    company: {
      name: 'Google',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
      industry: 'Technology'
    },
    location: 'San Francisco, CA',
    connectionDate: '2024-01-15',
    mutualConnections: 12
  },
  {
    id: '2',
    firstName: 'Marcus',
    lastName: 'Johnson',
    fullName: 'Marcus Johnson',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    headline: 'Software Engineer at Microsoft',
    currentPosition: 'Senior Software Engineer',
    company: {
      name: 'Microsoft',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
      industry: 'Technology'
    },
    location: 'Seattle, WA',
    connectionDate: '2024-02-20',
    mutualConnections: 8
  },
  {
    id: '3',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    fullName: 'Emily Rodriguez',
    profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    headline: 'Data Scientist at Netflix',
    currentPosition: 'Senior Data Scientist',
    company: {
      name: 'Netflix',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
      industry: 'Entertainment'
    },
    location: 'Los Angeles, CA',
    connectionDate: '2024-01-10',
    mutualConnections: 15
  },
  {
    id: '4',
    firstName: 'David',
    lastName: 'Kim',
    fullName: 'David Kim',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    headline: 'UX Designer at Apple',
    currentPosition: 'Senior UX Designer',
    company: {
      name: 'Apple',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Apple_logo_grey.svg',
      industry: 'Technology'
    },
    location: 'Cupertino, CA',
    connectionDate: '2024-03-05',
    mutualConnections: 23
  },
  {
    id: '5',
    firstName: 'Amanda',
    lastName: 'Thompson',
    fullName: 'Amanda Thompson',
    profilePicture: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400&h=400&fit=crop&crop=face',
    headline: 'Marketing Director at Tesla',
    currentPosition: 'Director of Marketing',
    company: {
      name: 'Tesla',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Tesla_T_symbol.svg',
      industry: 'Automotive'
    },
    location: 'Austin, TX',
    connectionDate: '2024-02-28',
    mutualConnections: 7
  },
  {
    id: '6',
    firstName: 'James',
    lastName: 'Wilson',
    fullName: 'James Wilson',
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    headline: 'DevOps Engineer at Amazon',
    currentPosition: 'Senior DevOps Engineer',
    company: {
      name: 'Amazon',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
      industry: 'Technology'
    },
    location: 'New York, NY',
    connectionDate: '2024-01-22',
    mutualConnections: 19
  },
  {
    id: '7',
    firstName: 'Lisa',
    lastName: 'Park',
    fullName: 'Lisa Park',
    profilePicture: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face',
    headline: 'Product Designer at Spotify',
    currentPosition: 'Lead Product Designer',
    company: {
      name: 'Spotify',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
      industry: 'Entertainment'
    },
    location: 'Stockholm, Sweden',
    connectionDate: '2024-03-12',
    mutualConnections: 11
  },
  {
    id: '8',
    firstName: 'Michael',
    lastName: 'Brown',
    fullName: 'Michael Brown',
    profilePicture: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=400&h=400&fit=crop&crop=face',
    headline: 'Solutions Architect at Salesforce',
    currentPosition: 'Senior Solutions Architect',
    company: {
      name: 'Salesforce',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg',
      industry: 'Technology'
    },
    location: 'San Francisco, CA',
    connectionDate: '2024-02-14',
    mutualConnections: 16
  }
];