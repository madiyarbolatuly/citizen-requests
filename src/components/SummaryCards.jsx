import {
  Box,
  Chip,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';

const STATUS_ORDER = ['В работе', 'Решено', 'Отклонено'];

function countBy(items, getKey) {
  const m = new Map();
  for (const it of items ?? []) {
    const k = getKey(it);
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return m;
}

export default function SummaryCards({ items }) {
  const total = (items ?? []).length;

  const byStatus = countBy(items, (r) => r.status ?? '');
  const statuses = STATUS_ORDER.filter((s) => byStatus.has(s));

  const byCategory = countBy(items, (r) => r.category ?? '');
  const topCategories = [...byCategory.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        height: '100%',
        backgroundImage:
          'radial-gradient(800px circle at 0% 0%, rgba(37,99,235,0.10), transparent 55%), radial-gradient(600px circle at 100% 0%, rgba(124,58,237,0.10), transparent 50%)',
      }}
    >
      <Stack spacing={1.5}>
        <Box>
          <Stack direction="row" alignItems="center" spacing={1}>
            <DashboardOutlinedIcon fontSize="small" />
            <Typography variant="subtitle1">Сводка</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            По текущим фильтрам
          </Typography>
        </Box>

        <Box>
          <Typography variant="body2">
            Всего обращений: <b>{total}</b>
          </Typography>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            По статусам
          </Typography>
          <Stack spacing={1}>
            {statuses.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Нет данных
              </Typography>
            ) : (
              statuses.map((s) => {
                const n = byStatus.get(s) ?? 0;
                const pct = total ? Math.round((n / total) * 100) : 0;
                return (
                  <Box key={s}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
                      <Chip size="small" label={s} />
                      <Typography variant="caption" color="text.secondary">
                        {n} ({pct}%)
                      </Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={pct} />
                  </Box>
                );
              })
            )}
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Топ категорий
          </Typography>
          <Stack spacing={0.75}>
            {topCategories.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Нет данных
              </Typography>
            ) : (
              topCategories.map(([cat, n]) => (
                <Stack key={cat} direction="row" justifyContent="space-between">
                  <Typography variant="body2">{cat}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {n}
                  </Typography>
                </Stack>
              ))
            )}
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}
