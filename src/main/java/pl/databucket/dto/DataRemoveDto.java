package pl.databucket.dto;

import lombok.Getter;
import lombok.Setter;
import pl.databucket.service.data.SearchRules;

import java.util.List;
import java.util.Map;

@Getter
@Setter
public class DataRemoveDto implements SearchRules {

    // Search rules
    private List<Map<String, Object>> conditions; // Old filtering method
    private Map<String, Object> logic; // New rules defined in frontend (property is saved as prop.$*group*itemName)
    private Map<String, Object> rules; // New rules defined in code (property is saved as $.group.itemName)

}
