import { Col, Layout, Pagination, Row } from 'antd';
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
import { numberWithCommas } from '../lib/utils';

const initialState = { pages: {}, totalPages: 0 };

function reducer(state, action) {
  if (action === null) {
    return { ...initialState };
  }
  return {
    pages: { ...state.pages, [action.page]: action.items },
    totalPages: action.totalPages
  };
}

export default function Home() {
  const router = useRouter();
  const searchTerm = useRef<string | null>(null);
  const page = useRef<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchMessage, setSearchMessage] = useState<any | null>(null);
  const [users, dispatch] = useReducer(reducer, initialState);

  const searchDone = (message: any, newPage: number | null = null) => {
    page.current = null;
    setSearchMessage(message);
    // work around to get animation to fire
    requestAnimationFrame(() => {
      page.current = newPage;
      setLoading(false);
    });
  };

  const handleSearch = async (value?: string | null, pageOverride?: number) => {
    if (typeof value === 'string') {
      if (searchTerm.current !== value) {
        page.current = null;
        setSearchMessage(null);
        dispatch(null); // clear save pages
      }
      searchTerm.current = value;
      setLoading(true);

      try {
        const res = await fetch(
          apiRoutes.services.github.users(
            value,
            pageOverride || page.current || undefined
          )
        );
        const data = await res.json();
        dispatch(data);
        if (data.totalPages > 0) {
          searchDone(
            <>
              Results: <strong>{numberWithCommas(data.total)}</strong>
            </>,
            data.page
          );
        } else {
          searchDone('No results found');
        }
      } catch (err) {
        searchDone(err.message);
      }
    }
  };

  useEffect(() => {
    if (router.query.q) handleSearch(router.query.q as string);
  }, [router.query.q]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (typeof users.pages[newPage] !== 'undefined') {
        page.current = null;
        setLoading(true);
        requestAnimationFrame(() => {
          page.current = newPage;
          setLoading(false);
        });
      } else {
        handleSearch(searchTerm.current, newPage);
      }
    },
    [users]
  );

  const pagination =
    page.current !== null && users.totalPages > 1 ? (
      <Pagination
        disabled={loading}
        defaultCurrent={page.current}
        total={users.totalPages}
        onChange={handlePageChange}
        showSizeChanger={false}
      />
    ) : null;

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
            onSearch={(term) => handleSearch(term)}
          />
          <div>{searchMessage || <>&nbsp;</>}</div>
          {pagination}
          <UserList
            data={page.current !== null ? users.pages[page.current] : []}
            match={searchTerm}
          />
          {pagination}
        </Col>
      </Row>
      <Footer />
    </Layout>
  );
}
