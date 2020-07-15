import { Col, Layout, Row } from 'antd';
import Search from 'antd/lib/input/Search';
import { useRouter } from 'next/router';
import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState
} from 'react';

import Footer from '../components/footer';
import UserList from '../components/user-list';
import apiRoutes from '../lib/api';

const initialState = { pages: {}, totalPages: 0 };

function reducer(state, action) {
  return {
    pages: { ...state.pages, [action.page]: action.items },
    totalPages: action.totalPages
  };
}

export default function Home() {
  const router = useRouter();
  const searchTerm = useRef<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchMessage, setSearchMessage] = useState<any | null>(null);
  const [users, dispatch] = useReducer(reducer, initialState);
  const [page, setPage] = useState<number | null>(null);

  const handleSearch = useCallback(
    async (value: string) => {
      searchTerm.current = value;
      setLoading(true);
      setSearchMessage(null);
      try {
        const res = await fetch(apiRoutes.services.github.users(value));
        const data = await res.json();
        console.log('got res data', data);
        dispatch(data);
        if (data.totalPages > 0) {
          if (page === null) {
            setPage(0);
          }
          setSearchMessage(
            <>
              Results: <strong>{data.total}</strong>
            </>
          );
        } else {
          setSearchMessage('No results found');
        }
      } catch (err) {
        setSearchMessage(err.message);
      }
      setLoading(false);
    },
    [page, dispatch]
  );

  useEffect(() => {
    if (router.query.q) handleSearch(router.query.q as string);
  }, [router.query.q]);

  return (
    <Layout
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Row
        gutter={[16, 16]}
        style={{ width: '100%', margin: 0, padding: '32px 0', flex: 1 }}
      >
        <Col
          xs={{ span: 22, offset: 1 }}
          lg={{ span: 20, offset: 2 }}
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
          }}
        >
          <Search
            key={(router.query.q as string) || ''}
            placeholder="Github User Search"
            loading={loading}
            enterButton={true}
            defaultValue={router.query.q}
            onSearch={handleSearch}
          />
          <div>{searchMessage || <>&nbsp;</>}</div>
          <UserList
            data={page !== null ? users.pages[page] : []}
            match={searchTerm}
          />
        </Col>
      </Row>
      <Footer />
    </Layout>
  );
}
