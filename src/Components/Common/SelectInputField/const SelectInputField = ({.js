const SelectInputField = ({ options, selectData, select = '' }) => {
  const [visibility, setVisibility] = useState(false);
  return (
    <>
      <div
        className="select"
        onClick={(e) => {
          setVisibility(!visibility);
          e.currentTarget.children[0].children[1].innerHTML = visibility
            ? 'arrow_drop_down'
            : 'arrow_drop_up';
        }}>
        <div className="selected-option">
          <span>{`${select.slice(0, 20)}...`}</span>
          <i className="material-icons">arrow_drop_down</i>
        </div>
        {visibility && (
          <div className="options">
            <ul>
              {options?.map((option) => (
                <li
                  key={option}
                  className={select === option ? 'active-option' : null}
                  onClick={() => {
                    selectData(option);
                  }}>
                  {option}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};
