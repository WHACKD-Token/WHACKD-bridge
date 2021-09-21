import { Router } from 'express';

import * as swapRequest from './controllers/swapRequest';
import * as walletAddress from './controllers/walletAddress';

const router: Router = Router();

// router.get('/getClaim/:id', acceptedAddress.getClaim);
router.post('/create-swap', swapRequest.createSwapRequest);
router.post('/check-update-swap', swapRequest.checkAndUpdateSwapRequest);
router.post('/check-swap', swapRequest.checkSwapRequest);

router.post('/create-wallet', walletAddress.createWallets);

// router.put('/updateClaim', acceptedAddress.updateClaim);

export default router;