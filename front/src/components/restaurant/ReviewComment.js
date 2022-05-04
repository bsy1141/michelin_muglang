import React, { useState } from "react";
import { useSelector } from "react-redux";
import DeleteConfirmationModal from "../modal/DeleteConfirmationModal";
import styles from "../../css/restaurant/ReviewComment.module.css";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  SubdirectoryArrowRight as ArrowIcon,
} from "@mui/icons-material";

const ReviewComment = ({ comment }) => {
  const [{ user }] = useSelector((state) => [state.user]);
  const [commentText, setCommentText] = useState(comment.text);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
  const [commentId, setCommentId] = useState("");

  const handleEdit = async (e) => {
    e.preventDefault();

    if (!commentText) return;

    setIsEditing(false);
  };

  return (
    <>
      <div className={styles.comment}>
        <div className={styles.comment_title}>
          <ArrowIcon fontSize="small" className={styles.icon_arrow} />
          <span className={styles.username}>{comment.userName}</span>
          <span className={styles.date}>{comment.createdAt.slice(0, 10)}</span>
          {user?.id === comment.userId && (
            <>
              <span
                className={styles.edit_btn}
                onClick={() => {
                  setIsEditing(true);
                }}
              >
                <EditIcon fontSize="small" />
              </span>
              <span
                className={styles.delete_btn}
                onClick={() => {
                  setDeleteConfirmModal(true);
                  setCommentId(comment._id);
                }}
              >
                <DeleteIcon fontSize="small" />
              </span>
            </>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleEdit} className={styles.edit_form}>
            <textarea
              value={commentText}
              onChange={(e) => {
                setCommentText(e.target.value);
              }}
            ></textarea>
            <button type="submit">수정</button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
              }}
            >
              닫기
            </button>
          </form>
        ) : (
          <div className={styles.content}>{comment.text}</div>
        )}
      </div>

      {deleteConfirmModal && (
        <DeleteConfirmationModal
          setIsModalOpen={setDeleteConfirmModal}
          modalContent={"댓글을"}
          //   api={{ method: "del", endpoint: "comments", params: comment._id }}
          //   action={deleteReview(commentId)}
        />
      )}
    </>
  );
};

export default ReviewComment;