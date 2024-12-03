import { Router } from "express";
import {
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  createPlaylist,
  deletePlaylist,
  updatePlaylist,
  getUserPlaylists,
} from "../controllers/playlist.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/create-playlist').post(verifyJwt, createPlaylist)
router.route('/get-user-playlists/:userId').get(verifyJwt, getUserPlaylists)
router.route('/get-playlist/:playlistId').get(verifyJwt, getPlaylistById)
router.route('/update-playlist/:playlistId').patch(verifyJwt, updatePlaylist)
router.route('/delete-playlist/:playlistId').delete(verifyJwt, deletePlaylist)
router.route('/add-video-to-playlist/:playlistId&:videoId').post(verifyJwt, addVideoToPlaylist)
router.route('/remove-video-from-playlist/:playlistId/:videoId').delete(verifyJwt, removeVideoFromPlaylist)

export default router;
