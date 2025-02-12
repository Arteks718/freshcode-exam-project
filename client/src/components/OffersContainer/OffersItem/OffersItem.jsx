import Rating from 'react-rating';
import { MdOutlineStar, MdOutlineStarBorder } from 'react-icons/md';
import styles from './OffersItem.module.sass';
import CONSTANTS from '../../../constants';

const OffersItem = (props) => {
  const { text, id } = props.data;
  const {
    industry,
    brandStyle,
    contestType,
    typeOfName,
    typeOfTagline,
    originalFileName,
    fileName,
  } = props.data.Contest;

  const { rating } = props.data.User;

  const type =
    contestType + ' / ' + (typeOfName ?? brandStyle ?? typeOfTagline);
  // id, contestType / brandStyle, industry
  // content: text / file, creative rating
  //
  // Buttons Approved / Reject
  return (
    <div className={styles.item}>
      <div>
        <div className={styles.contestInfo}>
          <span className={styles.industryName}>{industry}</span>
          <span className={styles.offerId}>(#{id})</span>
        </div>
        <div className={styles.contestType}>{type}</div>
      </div>
      <div>
        <div className={styles.creativeRating}>
          <span className={styles.userScoreLabel}>Creative Rating </span>
          <Rating
            initialRating={rating}
            fractions={2}
            fullSymbol={<MdOutlineStar size="20" color="#556da5" alt="star" />}
            placeholderSymbol={
              <MdOutlineStar size="20" color="#556da5" alt="star" />
            }
            emptySymbol={
              <MdOutlineStarBorder size="20" color="#556da5" alt="star" />
            }
            readonly
          />
        </div>
        <div>
          Offer:
          {text ?? (
            <a
              target="_blank"
              className={styles.file}
              href={`${CONSTANTS.publicURL}${fileName}`}
              download={originalFileName}
              rel="noreferrer"
            >
              {originalFileName}
            </a>
          )}
        </div>
      </div>
      <div className={styles.btnsContainer}>
        <button className={styles.approveBtn}>Approve</button>
        <button className={styles.rejectBtn}>Reject</button>
      </div>
    </div>
  );
};

export default OffersItem;
