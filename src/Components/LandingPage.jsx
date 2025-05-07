import React, { useContext, useState } from 'react';
import { Layout, Input, Typography, Button, message } from 'antd';
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;
const { Search } = Input;

const isURL = (input) => { // checking Incoming params is URL or not 
  const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
  return urlRegex.test(input.trim());
}

const LandingPage = () => {
  const [url, setUrl] = useState('');
  const { setGlobalListState, setDynamicURL } = useContext(UserContext)
  const navigate = useNavigate();

  const dynamicScrapURL = (scrappingURL) => {
    if (isURL(scrappingURL)) {
      setDynamicURL(scrappingURL)
      navigate('/search')
      return
    } else {
      setDynamicURL(scrappingURL)
      navigate('/list')
      return
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#001529', padding: '0 20px', display: 'flex', alignItems: 'center' }}>
        <Title level={3} style={{ color: 'white', margin: 0 }}>ScrapEase</Title>
      </Header>

      <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
        <div style={{ textAlign: 'center', maxWidth: 600 }}>
          <Title>Welcome to ScrapEase</Title>
          <Paragraph type="secondary">
            Enter a URL to instantly scrape and analyze data. Our fast and simple interface makes data extraction effortless.
          </Paragraph>
          <Search
            placeholder="https://example.com"
            enterButton="Scrape Now"
            size="large"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{ marginTop: 20 }}
            onSearch={() => dynamicScrapURL(url)}
          />
        </div>
      </Content>

    </Layout>
  );
};

export default LandingPage;
