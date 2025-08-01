import { CiSearch } from 'react-icons/ci';
import styles from './SearchSection.module.sass';
import HOW_IT_WORKS_CONSTANTS from '../howItWorksConstants';

const SearchSection = () => {
  return (
    <section className={styles.searchSection}>
      <div className={styles.searchContainer}>
        <form className={styles.searchForm}>
          <CiSearch className={styles.icon}  />
          <input
            name="search_field"
            type="text"
            placeholder="Search Over 300,000+ Premium Names"
          />
          <button aria-label="Search Domain">
            <CiSearch />
          </button>
        </form>
        <div className={styles.listTags}>
          {HOW_IT_WORKS_CONSTANTS.tags.map((item, index) => (
            <a href={item.link} key={index}>{item.tag}</a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
