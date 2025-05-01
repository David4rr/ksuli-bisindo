import PropTypes from "prop-types";

const CardList = ({ title, image, onClick }) => {
  return (
    <div
      className="card bg-white shadow hover:bg-neutral w-fit h-fit"
      onClick={onClick}>
      <div className="card-body">
        <h1 className="card-title text-black items-center justify-center text-xl font-bold font-poppins">
          {title}
        </h1>
      </div>
      <figure>
        <img
          className="w-full h-full object-cover"
          src={image}
          alt={title}
        />
      </figure>
    </div>
  );
};

CardList.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default CardList;