package pl.databucket.exception;

public class EmptyInputValueException extends Exception {

	public EmptyInputValueException(String itemName) {
        super("The '" + itemName + "' item can not be empty!");
    }

}
