import { useEffect, useMemo, useState } from 'react';
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  Fade,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';

import { useAsync } from './lib/useAsync';
import { loadRequests } from './lib/requestsApi';
import { filterRequests, STATUS_OPTIONS } from './lib/requestsFilters';
import { PAGE_SIZE } from './lib/constants';
import { paginate } from './lib/pagination';
import { useDebouncedValue } from './lib/useDebouncedValue';
import { sortRequests } from './lib/sort';
import { readQueryState, writeQueryState } from './lib/urlState';

import RequestsTable from './components/RequestsTable';
import RequestsMap from './components/RequestsMap';
import RequestDetailsModal from './components/RequestDetailsModal';
import SummaryCards from './components/SummaryCards';

export default function App() {
  const initial = useMemo(() => (typeof window !== 'undefined' ? readQueryState() : null), []);

  const [status, setStatus] = useState(initial?.status ?? '');
  const [query, setQuery] = useState(initial?.q ?? '');
  const [page, setPage] = useState(initial?.page ?? 1);
  const [selected, setSelected] = useState(null);
  const [sort, setSort] = useState({
    key: initial?.sortKey ?? 'created_at',
    dir: initial?.sortDir ?? 'desc',
  });

  const debouncedQuery = useDebouncedValue(query, 200);

  const asyncState = useAsync(loadRequests, []);

  const raw = asyncState.data ?? [];
  const filtered = useMemo(
    () => filterRequests(raw, { status, query: debouncedQuery }),
    [raw, status, debouncedQuery],
  );
  const sorted = useMemo(() => sortRequests(filtered, sort), [filtered, sort]);
  const pageModel = useMemo(() => paginate(sorted, page, PAGE_SIZE), [sorted, page]);

  useEffect(() => {
    writeQueryState({
      status,
      q: query,
      page,
      sortKey: sort?.key,
      sortDir: sort?.dir,
    });
  }, [status, query, page, sort]);

  function handleStatusChange(next) {
    setStatus(next);
    setPage(1);
  }
  function handleQueryChange(next) {
    setQuery(next);
    setPage(1);
  }

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Обращения граждан
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <SummaryCards items={sorted} />
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel id="status-label">Статус</InputLabel>
                <Select
                  labelId="status-label"
                  value={status}
                  label="Статус"
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  <MenuItem value="">Все</MenuItem>
                  {STATUS_OPTIONS.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                size="small"
                label="Поиск (категория или адрес)"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                sx={{ flex: 1, minWidth: 260 }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary" sx={{ mt: { xs: 1, md: 0 } }}>
              Всего: {filtered.length} • Страница {pageModel.page} из {pageModel.totalPages}
            </Typography>
          </Grid>

          <Grid item xs={12} lg={7}>
            <Fade in timeout={250}>
              <Box>
                <RequestsTable
                  loading={asyncState.status === 'loading'}
                  error={asyncState.error}
                  rows={pageModel.pageItems}
                  page={pageModel.page}
                  totalPages={pageModel.totalPages}
                  onPageChange={setPage}
                  onRowClick={setSelected}
                  selectedId={selected?.id ?? null}
                  sort={sort}
                  onSortChange={(nextSort) => {
                    setSort(nextSort);
                    setPage(1);
                  }}
                />
              </Box>
            </Fade>
          </Grid>

          <Grid item xs={12} lg={5}>
            <Fade in timeout={250}>
              <Box>
                <RequestsMap items={sorted} onSelect={setSelected} selectedId={selected?.id ?? null} />
              </Box>
            </Fade>
          </Grid>
        </Grid>
      </Container>

      <RequestDetailsModal request={selected} onClose={() => setSelected(null)} />
    </>
  );
}
