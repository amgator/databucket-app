package pl.databucket.dto;

import lombok.Getter;
import lombok.Setter;
import pl.databucket.configuration.Constants;
import javax.validation.constraints.Size;
import java.util.Date;
import java.util.Set;

@Getter
@Setter
public class ViewDto {
    private Long id;
    @Size(min = Constants.NAME_MIN, max = Constants.NAME_MAX)
    private String name;
    @Size(max = Constants.DESCRIPTION_MAX)
    private String description;
    private Set<Long> classesIds;
    private Set<Long> bucketsIds;
    private Set<Long> usersIds;
    private Set<Short> teamsIds;
    private long columnsId;
    private Long filterId;
    private Short roleId;
    private Short[] featuresIds;

    private String createdBy;
    private Date createdAt;
    private String modifiedBy;
    private Date modifiedAt;
}
