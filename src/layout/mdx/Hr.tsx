type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLHRElement>, HTMLHRElement>;

function Hr(props: Props) {
    return <hr {...props} />;
}

export { Hr };
export default Hr;
