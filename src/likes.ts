import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import {
  disLikeTrack,
  getFavoriteTracks,
  likeTrack,
} from "./store/features/playlistSlice";
import { trackType } from "./types";
import { deleteFavoriteTracks, favoriteTracks } from "./api/tracks";

export function useInitializeLikedTracks() {
  const dispatch = useAppDispatch();

  const tokens = useAppSelector((state) => state.auth.tokens);
  useEffect(() => {
    if (tokens.access) {
      dispatch(getFavoriteTracks(tokens.access));
    }
  }, [tokens, dispatch]);
}

export const useLikeTrack = (track: trackType) => {
  const dispatch = useAppDispatch();
  const likedTracks = useAppSelector((state) => state.playlist.likedTracks);

  console.log(track);
  const isLiked = likedTracks.some((t) => t._id === track?._id);

  const tokens = useAppSelector((state) => state.auth.tokens);

  const [showModal, setShowModal] = useState(false);

  const handleLike = async (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation();
    if (!tokens.access) {
      return setShowModal(true);
    }
    const action = !isLiked ? favoriteTracks : deleteFavoriteTracks;
    try {
      await action(tokens.access, track._id);
      isLiked ? dispatch(disLikeTrack(track)) : dispatch(likeTrack(track));
    } catch (error) {
      console.error(error);
    }
  };
  return { isLiked, handleLike, showModal, setShowModal };
};

