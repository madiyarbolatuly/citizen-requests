import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';

function StatusChip({ status }) {
  if (status === 'Решено') return <Chip size="small" color="success" label={status} />;
  if (status === 'Отклонено') return <Chip size="small" color="error" label={status} />;
  return <Chip size="small" color="warning" label={status ?? ''} />;
}

export default function RequestDetailsModal({ request, onClose }) {
  const open = Boolean(request);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        {!request ? 'Карточка обращения' : `Обращение #${request.id}`}
      </DialogTitle>
      <DialogContent dividers>
        {!request ? null : (
          <Stack spacing={1.25}>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
              <StatusChip status={request.status} />
              <Chip size="small" icon={<EventOutlinedIcon />} label={request.created_at} variant="outlined" />
            </Stack>

            <Divider />

            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <CategoryOutlinedIcon fontSize="small" color="action" />
                <Typography>
                  <b>Категория:</b> {request.category}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <PlaceOutlinedIcon fontSize="small" color="action" />
                <Typography>
                  <b>Адрес:</b> {request.address}
                </Typography>
              </Stack>
            </Stack>

            <Divider />

            <Typography sx={{ whiteSpace: 'pre-wrap' }}>
              <b>Описание:</b> {request.description}
            </Typography>

            <Typography>
              <b>Координаты:</b> {request.latitude}, {request.longitude}
            </Typography>

            {request.photo ? (
              <Box sx={{ mt: 1 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Фото
                </Typography>
                <Box
                  component="img"
                  src={request.photo}
                  alt={`Фото обращения ${request.id}`}
                  sx={{ width: '100%', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}
                />
              </Box>
            ) : null}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
}
