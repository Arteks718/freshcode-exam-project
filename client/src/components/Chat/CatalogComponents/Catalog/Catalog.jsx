import styles from './Catalog.module.sass';
import { FaTrashAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Catalog = (props) => {
  const { deleteCatalog, goToCatalog, catalog } = props;
  const { catalogName, chats, id } = catalog;

  const handleDeleteCatalog = (event) => {
    try {
      deleteCatalog(event, id);
      toast.success(`Catalog - ${catalogName} was successfully deleted`);
    } catch (error) {
      toast.error(`Error deleting catalog: ${error.message}`);
      return;
    }
  };

  return (
    <div
      className={styles.catalogContainer}
      onClick={(event) => goToCatalog(event, catalog)}
    >
      <span className={styles.catalogName}>{catalogName}</span>
      <div className={styles.infoContainer}>
        <span>Chats number: </span>
        <span className={styles.numbers}>{chats.length}</span>
        <FaTrashAlt onClick={handleDeleteCatalog} />
      </div>
    </div>
  );
};

export default Catalog;
