import React, { useState } from 'react';
import { Box, Button, Hero, Section, Container, Heading, Form, Image, Columns } from 'react-bulma-components';
import moment from 'moment';

const tomorrow = moment().add(1, 'day').format('YYYY-MM-DD');

const App = () => {
  const [city, setCity] = useState('Paris');
  const [date, setDate] = useState(tomorrow);
  const [locale, setLocale] = useState('en');
  const getImageURL = () => `/api/svg/weather-two-days?city=${encodeURIComponent(city)}&date=${date}&locale=${locale}`;
  const [imageURL, setImageURL] = useState(getImageURL());
  const onSubmit = () => {
    setImageURL(getImageURL());
  };

  const canSubmit = !!city && !!date && !!locale;

  return (
    <div>
      <Section>
        <Hero>
          <Hero.Body>
            <Container>
              <Heading>Joto weather</Heading>
              <Heading subtitle>
                Generate SVG images around weather for your{' '}
                <a href="https://joto.rocks" title="Joto">
                  Joto
                </a>
                .
              </Heading>
            </Container>
          </Hero.Body>
        </Hero>
      </Section>
      <Columns>
        <Columns.Column size="half" offset="one-quarter">
          <Box>
            <Heading size={4}>Weather for two days</Heading>
            <Form.Field>
              <Form.Label>City</Form.Label>
              <Form.Control>
                <Form.Input placeholder="Paris" value={city} onChange={(e) => setCity(e.target.value)} />
              </Form.Control>
              <Form.Help>
                You can specify the country code if needed: <code>New York,US</code>.
              </Form.Help>
            </Form.Field>
            <Form.Field>
              <Form.Label>Date</Form.Label>
              <Form.Control>
                <Form.Input placeholder="YYYY-MM-DD" value={date} onChange={(e) => setDate(e.target.value)} />
              </Form.Control>
              <Form.Help>
                Format: <code>YYYY-MM-DD</code>. Must be between today and{' '}
                {moment().add(4, 'days').format('YYYY-MM-DD')}.
              </Form.Help>
            </Form.Field>
            <Form.Field>
              <Form.Label>Locale</Form.Label>
              <Form.Control>
                <Form.Select value={locale} onChange={(e) => setLocale(e.target.value)}>
                  <option value="en">English</option>
                  <option value="fr">French</option>
                </Form.Select>
              </Form.Control>
            </Form.Field>
            <Form.Field>
              <Form.Control>
                <Button color="link" disabled={!canSubmit} onClick={onSubmit}>
                  Get image
                </Button>
              </Form.Control>
            </Form.Field>
            {imageURL ? <Image src={imageURL} alt="Joto image" /> : null}
          </Box>
        </Columns.Column>
      </Columns>
    </div>
  );
};

export default App;
