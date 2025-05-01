import PropTypes from 'prop-types';

const Button = (props) => {
    const { children, className = "bg-black, text-white", onClick = () => {}, type = "button" } = props;
    return (
        <button
            className={`h-full px-6 font-semibold rounded-md ${className}`}
            type={type}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string, 
    onClick: PropTypes.func.isRequired,
    type: PropTypes.string
};

export default Button;